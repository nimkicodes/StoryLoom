import express from 'express';
import { syncUser, getUserProfile } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/sync', verifyToken, syncUser);
router.get('/:userId', getUserProfile);

export default router;
