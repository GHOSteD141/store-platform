import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

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

// A simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: "Hello from your new Maison backend!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});