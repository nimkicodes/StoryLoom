import { getDB } from '../db.js';
import { admin } from '../db.js';

export const toggleBookmark = async (req, res) => {
  try {
    const db = getDB();
    const { zineId } = req.body;
    const userId = req.user.uid;

    if (!zineId) {
      return res.status(400).send('Zine ID is required.');
    }

    const bookmarksRef = db.collection('bookmarks');
    const query = bookmarksRef.where('userId', '==', userId).where('zineId', '==', zineId);
    const snapshot = await query.get();

    if (snapshot.empty) {
      // Create bookmark
      await bookmarksRef.add({
        userId,
        zineId,
        createdAt: new Date()
      });
      res.status(201).json({ bookmarked: true });
    } else {
      // Remove bookmark
      const docId = snapshot.docs[0].id;
      await bookmarksRef.doc(docId).delete();
      res.status(200).json({ bookmarked: false });
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    res.status(500).send('Failed to toggle bookmark.');
  }
};

export const getBookmarks = async (req, res) => {
  try {
    const db = getDB();
    const userId = req.user.uid;

    const bookmarksSnapshot = await db.collection('bookmarks').where('userId', '==', userId).get();
    const zineIds = bookmarksSnapshot.docs.map(doc => doc.data().zineId);

    if (zineIds.length === 0) {
      return res.status(200).json([]);
    }

    // Firestore 'in' query supports up to 10 values. If we have more, we might need to batch or fetch all zines and filter (not ideal but okay for MVP).
    // For now, let's assume < 10 or just fetch individually if needed.
    // Actually, let's just fetch the zine details for these IDs.
    // Since 'in' limit is 10, let's do Promise.all for now which is simpler for > 10 items than chunking 'in' queries.

    const zinePromises = zineIds.map(id => db.collection('zines').doc(id).get());
    const zineSnapshots = await Promise.all(zinePromises);

    const zines = zineSnapshots
      .filter(doc => doc.exists)
      .map(doc => ({ _id: doc.id, ...doc.data() }));

    res.status(200).json(zines);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).send('Failed to fetch bookmarks.');
  }
};

export const checkBookmarkStatus = async (req, res) => {
  try {
    const db = getDB();
    const { zineId } = req.params;
    const userId = req.user.uid;

    const snapshot = await db.collection('bookmarks')
      .where('userId', '==', userId)
      .where('zineId', '==', zineId)
      .get();

    res.status(200).json({ bookmarked: !snapshot.empty });
  } catch (error) {
    console.error('Error checking bookmark status:', error);
    res.status(500).send('Failed to check bookmark status.');
  }
};
