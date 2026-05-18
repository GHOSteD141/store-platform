import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  location: { 
    type: String, 
    required: true, 
    unique: true 
  },
  imageUrl: { 
    type: String, 
    required: true 
  },
  // THIS IS THE VIP GUEST WE NEED TO ADD!
  previousImageUrl: { 
    type: String 
  },
  title: { 
    type: String 
  }
}, { timestamps: true });

export default mongoose.model('Banner', bannerSchema);