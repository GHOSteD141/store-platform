import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true }, // This is where the Cloudinary link goes!
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Banner', bannerSchema);