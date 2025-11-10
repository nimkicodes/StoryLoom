import express from 'express';
import multer from 'multer';
import { processAndUploadImages, getAllZines } from '../controllers/zineController.js';

const router = express.Router(); 

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ... (multer config) ...

router.post('/upload', upload.array('images', 20), processAndUploadImages);
router.get('/', getAllZines);

export default router;
