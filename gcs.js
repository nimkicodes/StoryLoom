import { Storage } from '@google-cloud/storage';
import path from 'path';

// Initialize storage
const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

/**
 * Uploads a file buffer to Google Cloud Storage.
 * @param {Buffer} buffer The file buffer to upload.
 * @param {string} originalname The original name of the file.
 * @returns {Promise<string>} The public URL of the uploaded file.
 */
const uploadToGCS = (buffer, originalname) => {
  return new Promise((resolve, reject) => {
    const destination = `zines/raw/${Date.now()}-${path.basename(originalname)}`;
    const file = bucket.file(destination);

    console.log(`[GCS] Starting upload for ${originalname} to gs://${bucket.name}/${destination}`);

    const stream = file.createWriteStream({
      metadata: {
        // The original mimetype of the file will be inferred by GCS
      },
      resumable: false,
    });

    stream.on('error', (err) => {
      console.error(`[GCS] Error uploading ${originalname}:`, err);
      reject(err);
    });

    stream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
      console.log(`[GCS] Successfully uploaded ${originalname} to ${publicUrl}`);
      resolve(publicUrl);
    });

    stream.end(buffer);
  });
};

export { uploadToGCS };
