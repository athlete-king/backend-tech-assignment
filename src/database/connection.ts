import mongoose from 'mongoose';

import { config } from '../config/index.js';

const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(config.dbURI);
    console.log(`✅ MongoDB Connected: ${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err}`);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export { connectDatabase };