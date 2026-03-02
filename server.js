import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import zineRoutes from './routes/zineRoutes.js';
import bookmarkRoutes from './routes/bookmarkRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { connectDB } from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

connectDB().then(() => {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    });
    next();
  });
  app.use(cors());
  app.use(express.json());

  app.use('/api/zines', zineRoutes);
  app.use('/api/bookmarks', bookmarkRoutes);
  app.use('/api/users', userRoutes);

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Oops we have a problem!');
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
