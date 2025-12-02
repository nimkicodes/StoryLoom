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
    const startUser = Date.now();
    const userDoc = await userRef.get();
    console.log(`[Firestore] Get User ${userId}: ${Date.now() - startUser}ms`);

    if (!userDoc.exists) {
      return res.status(404).send('User profile not found.');
    }

    const userData = userDoc.data();
    const bookmarks = userData.bookmarkedZines || [];
    const isBookmarked = bookmarks.some(z => z.zineId === zineId);

    if (isBookmarked) {
      // Remove
      // For object array, we need to filter because arrayRemove requires exact object match
      const currentBookmarkedZines = userData.bookmarkedZines || [];
      const updatedBookmarkedZines = currentBookmarkedZines.filter(z => z.zineId !== zineId);

      const startUpdate = Date.now();
      await userRef.update({
        bookmarkedZines: updatedBookmarkedZines
      });
      console.log(`[Firestore] Update User Bookmarks (Remove): ${Date.now() - startUpdate}ms`);

      // Also remove from bookmarks collection (optional, keeping for now as backup/audit)
      const snapshot = await db.collection('bookmarks').where('userId', '==', userId).where('zineId', '==', zineId).get();
      if (!snapshot.empty) {
        // Delete all matches just in case
        const batch = db.batch();
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
      }
      res.status(200).json({ bookmarked: false });
    } else {
      // Add
      // Fetch zine details first
      const startZine = Date.now();
      const zineDoc = await db.collection('zines').doc(zineId).get();
      console.log(`[Firestore] Get Zine ${zineId}: ${Date.now() - startZine}ms`);
      if (!zineDoc.exists) {
        return res.status(404).send('Zine not found.');
      }
      const zineData = zineDoc.data();

      const newBookmark = {
        zineId: zineId,
        title: zineData.title || 'Untitled',
        author: zineData.author || 'Unknown',
        coverImage: (zineData.pages && zineData.pages[0]) ? zineData.pages[0] : '',
        addedAt: new Date().toISOString()
      };

      const startUpdate = Date.now();
      await userRef.update({
        bookmarkedZines: admin.firestore.FieldValue.arrayUnion(newBookmark)
      });
      console.log(`[Firestore] Update User Bookmarks (Add): ${Date.now() - startUpdate}ms`);

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

    const startGet = Date.now();
    const userDoc = await db.collection('users').doc(userId).get();
    console.log(`[Firestore] Get User Bookmarks ${userId}: ${Date.now() - startGet}ms`);
    if (!userDoc.exists) {
      return res.status(200).json([]);
    }

    const bookmarks = userDoc.data().bookmarkedZines || [];
    res.status(200).json(bookmarks);
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

    const startCheck = Date.now();
    const userDoc = await db.collection('users').doc(userId).get();
    console.log(`[Firestore] Check Bookmark Status ${userId}: ${Date.now() - startCheck}ms`);
    const isBookmarked = userDoc.exists && (userDoc.data().bookmarkedZines || []).some(z => z.zineId === zineId);

    res.status(200).json({ bookmarked: isBookmarked });
  } catch (error) {
    console.error('Error checking bookmark status:', error);
    res.status(500).send('Failed to check bookmark status.');
  }
};
