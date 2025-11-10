import { MongoClient } from 'mongodb';

let client;
let db;

export const connectDB = async () => {
  if (db) return db;
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI not found in environment variables. Please check your .env file.');
    }
    client = new MongoClient(uri);
    await client.connect();
    console.log('MongoDB connected successfully.');
    db = client.db(); 
    return db;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

export const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
};
