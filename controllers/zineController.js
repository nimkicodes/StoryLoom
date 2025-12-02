import { uploadToGCS } from '../gcs.js';
import { getDB, admin } from '../db.js';

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
    let query = db.collection('zines').orderBy('createdAt', 'desc').orderBy('__name__', 'desc');

    if (req.query.userId) {
      query = query.where('userId', '==', req.query.userId);
    }

    if (req.query.tag) {
      query = query.where('tags', 'array-contains', req.query.tag);
    }

    if (req.query.limit) {
      const limit = parseInt(req.query.limit);
      if (!isNaN(limit) && limit > 0) {
        query = query.limit(limit);
      }
    }

    if (req.query.lastCreatedAt && req.query.lastId) {
      query = query.startAfter(new Date(req.query.lastCreatedAt), req.query.lastId);
    } else if (req.query.lastCreatedAt) {
      query = query.startAfter(new Date(req.query.lastCreatedAt));
    }

    const startQuery = Date.now();
    const snapshot = await query.get();
    console.log(`[Firestore] Get All Zines Query: ${Date.now() - startQuery}ms`);

    const zines = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      zines.push({
        _id: doc.id,
        ...data,
        createdAt: data.createdAt && data.createdAt.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
      });
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

    const startGet = Date.now();
    const doc = await db.collection('zines').doc(id).get();
    console.log(`[Firestore] Get Zine ${id}: ${Date.now() - startGet}ms`);

    if (!doc.exists) {
      return res.status(404).send('Zine not found.');
    }

    const data = doc.data();
    const zine = {
      _id: doc.id,
      ...data,
      createdAt: data.createdAt && data.createdAt.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
    };
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
      const startUpload = Date.now();
      const gcsUrl = await uploadToGCS(file.buffer, file.originalname);
      console.log(`[GCS] Upload File ${file.originalname}: ${Date.now() - startUpload}ms`);
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
    const startAdd = Date.now();
    const result = await db.collection('zines').add(zine);
    console.log(`[Firestore] Add Zine: ${Date.now() - startAdd}ms`);
    console.log(`[Controller] Successfully inserted zine into Firestore with ID: ${result.id}`);

    // Update user's createdZines array
    const userRef = db.collection('users').doc(req.user.uid);
    const zineSummary = {
      zineId: result.id,
      title: title,
      author: author,
      coverImage: imageUrls[0] || '',
      createdAt: new Date().toISOString()
    };

    const startUpdate = Date.now();
    await userRef.update({
      createdZines: admin.firestore.FieldValue.arrayUnion(zineSummary)
    });
    console.log(`[Firestore] Update User Created Zines: ${Date.now() - startUpdate}ms`);
    console.log(`[Controller] Updated user ${req.user.uid} createdZines with new zine.`);

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

let tagsCache = null;
let tagsCacheTime = 0;
const TAGS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const getAllTags = async (req, res) => {
  try {
    const now = Date.now();
    if (tagsCache && (now - tagsCacheTime < TAGS_CACHE_TTL)) {
      console.log('[Controller] Returning tags from cache');
      return res.status(200).json(tagsCache);
    }

    const db = getDB();
    const startTags = Date.now();
    const snapshot = await db.collection('zines').select('tags').get();
    console.log(`[Firestore] Get All Tags: ${Date.now() - startTags}ms`);
    const tags = new Set();

    snapshot.forEach(doc => {
      const zineTags = doc.data().tags;
      if (Array.isArray(zineTags)) {
        zineTags.forEach(tag => tags.add(tag));
      }
    });

    tagsCache = Array.from(tags).sort();
    tagsCacheTime = Date.now();
    res.status(200).json(tagsCache);
  } catch (error) {
    console.error('[Controller] Error fetching tags:', error);
    res.status(500).send('Failed to fetch tags.');
  }
};
