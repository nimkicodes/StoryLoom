import { uploadToGCS } from '../gcs.js';
import { getDB } from '../db.js';

const slugify = (text) => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

export const getAllZines = async (req, res) => {
  console.log('[Controller] Entered getAllZines function.');
  try {
    const db = getDB();
    const zines = await db.collection('zines').find({}).sort({ createdAt: -1 }).toArray();
    res.status(200).json(zines);
  } catch (error) {
    console.error('[Controller] Error fetching all zines:', error);
    res.status(500).send('Failed to fetch zines.');
  }
};

export const processAndUploadImages = async (req, res) => {
  console.log('[Controller] Entered processAndUploadImages function.');

  if (!req.files || req.files.length === 0) {
    console.log('[Controller] No files were uploaded.');
    return res.status(400).send('No files uploaded.');
  }

  console.log(`[Controller] Received ${req.files.length} file(s) for GCS upload.`);

  try {
    const imageUrls = [];
    for (const file of req.files) {
      const gcsUrl = await uploadToGCS(file.buffer, file.originalname);
      imageUrls.push(gcsUrl);
    }

    const title = req.body.title;
    const author = req.body.author;
    const tags = req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];

    if (!title || title.trim() === '') {
      return res.status(400).send('Zine title is required.');
    }
    if (!author || author.trim() === '') {
      return res.status(400).send('Author name is required.');
    }

    const zine = {
      title,
      author,
      tags,
      pages: imageUrls,
      createdAt: new Date(),
    };
    
    const db = getDB();
    const result = await db.collection('zines').insertOne(zine);
    console.log(`[Controller] Successfully inserted zine into MongoDB with ID: ${result.insertedId}`);

    const responsePayload = {
      message: 'Zine created successfully!',
      zineId: result.insertedId,
      title: title,
      slug: slugify(title),
      pages: imageUrls,
    };
    console.log('[Controller] Sending success response to client:', responsePayload);
    res.status(201).json(responsePayload);

  } catch (error) {
    console.error('[Controller] An error occurred during the GCS upload workflow:', error);
    res.status(500).send('Failed to upload files to cloud storage.');
  }
};
