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

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      // Should ideally exist if synced, but handle case
      return res.status(404).send('User profile not found.');
    }

    const userData = userDoc.data();
    const bookmarks = userData.bookmarkedZineIds || [];
    const isBookmarked = bookmarks.includes(zineId);

    if (isBookmarked) {
      // Remove
      await userRef.update({
        bookmarkedZineIds: admin.firestore.FieldValue.arrayRemove(zineId)
      });
      // Also remove from bookmarks collection (optional, keeping for now as backup/audit)
      const snapshot = await db.collection('bookmarks').where('userId', '==', userId).where('zineId', '==', zineId).get();
      if (!snapshot.empty) {
        await db.collection('bookmarks').doc(snapshot.docs[0].id).delete();
      }
      res.status(200).json({ bookmarked: false });
    } else {
      // Add
      await userRef.update({
        bookmarkedZineIds: admin.firestore.FieldValue.arrayUnion(zineId)
      });
      // Also add to bookmarks collection
      await db.collection('bookmarks').add({
        userId,
        zineId,
        createdAt: new Date()
      });
      res.status(201).json({ bookmarked: true });
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

    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(200).json([]);
    }

    const zineIds = userDoc.data().bookmarkedZineIds || [];

    if (zineIds.length === 0) {
      return res.status(200).json([]);
    }

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

    const userDoc = await db.collection('users').doc(userId).get();
    const isBookmarked = userDoc.exists && (userDoc.data().bookmarkedZineIds || []).includes(zineId);

    res.status(200).json({ bookmarked: isBookmarked });
  } catch (error) {
    console.error('Error checking bookmark status:', error);
    res.status(500).send('Failed to check bookmark status.');
  }
};
