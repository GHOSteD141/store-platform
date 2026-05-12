import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { upload } from './config/cloudinary.js';
import Banner from './models/Banner.js';

// Load environment variables from our .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Lets our React app (port 5173) talk to this server (port 5000)
app.use(express.json()); // Allows us to send JSON data

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Successfully connected to MongoDB!'))
  .catch((error) => console.error('❌ MongoDB connection error:', error.message));

// --- ROUTES ---

// A simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: "Hello from your new Maison backend!" });
});

// GET: Send the active hero banner to the frontend homepage
app.get('/api/hero', async (req, res) => {
  try {
    const activeBanner = await Banner.findOne({ isActive: true }); 
    res.json(activeBanner);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});
//it gets img from cloudinary and then updates the banner in the database with the new image URL. 
// If there is no active banner, it creates a new one with the uploaded image.
// POST: Upload a new hero banner from the Admin panel
app.post('/api/admin/hero', upload.single('heroImage'), async (req, res) => {
  try {
    // req.file.path is the permanent URL Cloudinary hands back to us
    const newImageUrl = req.file.path; 

    // Find the current active banner and update it, or create a new one if it doesn't exist
    const updatedBanner = await Banner.findOneAndUpdate(
      { isActive: true }, 
      { imageUrl: newImageUrl, title: "Main Hero Banner" }, 
      { new: true, upsert: true } // upsert means "create it if it doesn't exist"
    );

    res.json({ success: true, banner: updatedBanner });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Failed to upload image" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});