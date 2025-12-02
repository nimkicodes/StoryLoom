import express from 'express';
import multer from 'multer';
import { processAndUploadImages, getAllZines, getZineById, getAllTags } from '../controllers/zineController.js';

const router = express.Router();

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ... (multer config) ...

import { verifyToken } from '../middleware/authMiddleware.js';

router.post('/upload', verifyToken, upload.array('images', 20), processAndUploadImages);
router.get('/', getAllZines);
router.get('/tags', getAllTags);
router.get('/:id', getZineById);

export default router;
