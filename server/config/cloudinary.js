import { v2 as cloudinary } from 'cloudinary'; 
import { CloudinaryStorage } from 'multer-storage-cloudinary'; 
import multer from 'multer'; 
import dotenv from 'dotenv'; 

dotenv.config(); 

// Validate environment variables early
const requiredEnvVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.warn(`Warning: ${varName} is missing in environment variables.`);
  }
});

// --- FIXED THE MISSING CLOSING BRACKET HERE ---
cloudinary.config({   
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,   
  api_key: process.env.CLOUDINARY_API_KEY,   
  api_secret: process.env.CLOUDINARY_API_SECRET 
}); 

// Set up the storage engine 
const storage = new CloudinaryStorage({   
  cloudinary: cloudinary,   
  params: {     
    folder: 'maison_boutique', 
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],     
    transformation: [{ width: 1920, height: 1920, crop: 'limit' }]   
  }
}); 

export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit files to 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
}); 
export { cloudinary };