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
    let query = db.collection('zines').orderBy('createdAt', 'desc');

    if (req.query.userId) {
      query = query.where('userId', '==', req.query.userId);
    }

    if (req.query.tag) {
      query = query.where('tags', 'array-contains', req.query.tag);
    }

    const snapshot = await query.get();

    const zines = [];
    snapshot.forEach(doc => {
      zines.push({ _id: doc.id, ...doc.data() });
    });

    res.status(200).json(zines);
  } catch (error) {
    console.error('[Controller] Error fetching all zines:', error);
    res.status(500).send('Failed to fetch zines.');
  }
};

export const getZineById = async (req, res) => {
  console.log('[Controller] Entered getZineById function.');
  try {
    const db = getDB();
    const { id } = req.params;

    const doc = await db.collection('zines').doc(id).get();

    if (!doc.exists) {
      return res.status(404).send('Zine not found.');
    }

    const zine = { _id: doc.id, ...doc.data() };
    res.status(200).json(zine);
  } catch (error) {
    console.error('[Controller] Error fetching zine by ID:', error);
    res.status(500).send('Failed to fetch zine.');
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
    const tags = req.body.tags ? req.body.tags.split(',').map(tag => tag.trim().toLowerCase().replace(/^#/, '').replace(/\s+/g, ' ')).filter(tag => tag.length > 0) : [];

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
      userId: req.user.uid, // Add user ID from auth token
      userEmail: req.user.email // Optional: Add user email
    };

    const db = getDB();
    const result = await db.collection('zines').add(zine);
    console.log(`[Controller] Successfully inserted zine into Firestore with ID: ${result.id}`);

    const responsePayload = {
      message: 'Zine created successfully!',
      zineId: result.id,
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

export const getAllTags = async (req, res) => {
  try {
    const db = getDB();
    const snapshot = await db.collection('zines').select('tags').get();
    const tags = new Set();

    snapshot.forEach(doc => {
      const zineTags = doc.data().tags;
      if (Array.isArray(zineTags)) {
        zineTags.forEach(tag => tags.add(tag));
      }
    });

    res.status(200).json(Array.from(tags).sort());
  } catch (error) {
    console.error('[Controller] Error fetching tags:', error);
    res.status(500).send('Failed to fetch tags.');
  }
};
