import { getDB, admin } from '../db.js';

export const syncUser = async (req, res) => {
  try {
    const db = getDB();
    const { uid, email, displayName, photoURL } = req.user; // from auth middleware

    const userRef = db.collection('users').doc(uid);
    const startGet = Date.now();
    const doc = await userRef.get();
    console.log(`[Firestore] Get User ${uid}: ${Date.now() - startGet}ms`);

    if (!doc.exists) {
      const startSet = Date.now();
      await userRef.set({
        email,
        displayName: displayName || email.split('@')[0],
        photoURL: photoURL || '',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`[Firestore] Create User ${uid}: ${Date.now() - startSet}ms`);
      console.log(`[UserController] Created new user document for ${uid}`);
    } else {
      // Optional: Update last login or other fields
      const startUpdate = Date.now();
      await userRef.update({
        updatedAt: new Date()
      });
      console.log(`[Firestore] Update User ${uid}: ${Date.now() - startUpdate}ms`);
    }

    res.status(200).json({ message: 'User synced successfully' });
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).send('Failed to sync user.');
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const db = getDB();
    const { userId } = req.params;

    const startGet = Date.now();
    const doc = await db.collection('users').doc(userId).get();
    console.log(`[Firestore] Get User Profile ${userId}: ${Date.now() - startGet}ms`);

    if (!doc.exists) {
      return res.status(404).send('User not found.');
    }

    res.status(200).json({ _id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).send('Failed to fetch user profile.');
  }
};
