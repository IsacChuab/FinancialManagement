import mongoose from 'mongoose';
import { MONGO_URL } from './config.js';

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}
