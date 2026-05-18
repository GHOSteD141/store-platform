import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary'; 
import { upload } from './config/cloudinary.js';
import Banner from './models/Banner.js';
import Product from './models/Product.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json()); 

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Successfully connected to MongoDB!'))
  .catch((error) => console.error('❌ MongoDB connection error:', error.message));


// --- UTILITY FUNCTION: Delete from Cloudinary ---
const getPublicIdFromUrl = (url) => {
  try {
    const afterUpload = url.split('/upload/')[1];
    const parts = afterUpload.split('/');
    parts.shift(); // Removes the version string
    return parts.join('/').split('.')[0]; 
  } catch (error) {
    return null;
  }
};


// --- SITE IMAGERY ROUTES ---

// GET: Fetch all site images and their backups
app.get('/api/site-images', async (req, res) => {
  try {
    const images = await Banner.find(); 
    // This is the crucial part that sends BOTH the live and backup image!
    const imageMap = images.reduce((acc, img) => {
      acc[img.location] = {
        live: img.imageUrl,
        backup: img.previousImageUrl || null
      };
      return acc;
    }, {});
    res.json(imageMap);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// POST: Upload with a Rolling Safety Net
app.post('/api/admin/site-images', upload.single('image'), async (req, res) => {
  try {
    const { location } = req.body;
    const newImageUrl = req.file.path; 

    const existingImage = await Banner.findOne({ location: location });
    let urlToBackup = null;

    if (existingImage && existingImage.imageUrl) {
      urlToBackup = existingImage.imageUrl;

      if (existingImage.previousImageUrl) {
        const publicId = getPublicIdFromUrl(existingImage.previousImageUrl);
        if (publicId) await cloudinary.uploader.destroy(publicId);
      }
    }

    const updatedImage = await Banner.findOneAndUpdate(
      { location: location }, 
      { 
        imageUrl: newImageUrl,
        previousImageUrl: urlToBackup 
      }, 
      { returnDocument: 'after', upsert: true } 
    );

    res.json({ success: true, image: updatedImage });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Failed to upload image" });
  }
});

// POST: The "Undo" Button Route
app.post('/api/admin/site-images/undo', async (req, res) => {
  try {
    const { location } = req.body;
    const banner = await Banner.findOne({ location });

    if (!banner || !banner.previousImageUrl) {
      return res.status(400).json({ message: "No backup exists to restore." });
    }

    const publicId = getPublicIdFromUrl(banner.imageUrl);
    if (publicId) await cloudinary.uploader.destroy(publicId);

    banner.imageUrl = banner.previousImageUrl;
    banner.previousImageUrl = null; 
    await banner.save();

    res.json({ success: true, message: "Restored previous image!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to undo" });
  }
});


// --- PRODUCT ROUTES ---

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }); 
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

app.post('/api/admin/products', upload.single('productImage'), async (req, res) => {
  try {
    const { name, description, price, category, stock, isFeatured } = req.body;
    const imageUrl = req.file ? req.file.path : ''; 
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newProduct = new Product({
      name, slug, description, price: Number(price), category,
      stock: Number(stock), isFeatured: isFeatured === 'true',
      images: [imageUrl] 
    });

    await newProduct.save();
    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "❌ A product with this exact name already exists." });
    }
    res.status(500).json({ message: "❌ Failed to upload product" });
  }
});

app.delete('/api/admin/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.images && product.images[0]) {
      const publicId = getPublicIdFromUrl(product.images[0]);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product fully deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});