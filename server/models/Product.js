import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true // This creates clean URLs like maison.com/products/amethyst-bracelet
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  category: { 
    type: String, 
    required: true // e.g., 'Crystals', 'Bracelets', 'Decor'
  },
  images: [{ 
    type: String // This will hold an array of Cloudinary image links
  }],
  stock: { 
    type: Number, 
    default: 1 // Crucial for tracking how many items are left to sell
  },
  isFeatured: { 
    type: Boolean, 
    default: false // Check this to make it show up on the homepage "Latest Products" section
  }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);