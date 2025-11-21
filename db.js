import admin from 'firebase-admin';
import { readFile } from 'fs/promises';

let db;
export { admin };

export const connectDB = async () => {
  if (db) return db;
  try {
    // Check if service-account.json exists
    try {
      const serviceAccount = JSON.parse(
        await readFile(new URL('./service-account.json', import.meta.url))
      );

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } catch (error) {
      console.error("Failed to load service-account.json. Make sure it exists in the root directory.", error);
      // Fallback for development if needed, or just error out
      if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        admin.initializeApp({
          credential: admin.credential.applicationDefault()
        });
      } else {
        throw new Error("Service account credentials not found.");
      }
    }

    console.log('Firebase Admin initialized successfully.');
    db = admin.firestore();
    return db;
  } catch (err) {
    console.error('Firebase connection error:', err);
    process.exit(1);
  }
};

export const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
};

