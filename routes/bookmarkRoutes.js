import express from 'express';
import { toggleBookmark, getBookmarks, checkBookmarkStatus } from '../controllers/bookmarkController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, toggleBookmark);
router.get('/', verifyToken, getBookmarks);
router.get('/:zineId', verifyToken, checkBookmarkStatus);

export default router;
