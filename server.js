import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import zineRoutes from './routes/zineRoutes.js';
import bookmarkRoutes from './routes/bookmarkRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { connectDB } from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Logging Middleware
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

// Middleware to ensure DB is connected
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database connection middleware error:', err);
    res.status(500).send('Database connection error');
  }
});

// API Routes
app.use('/api/zines', zineRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/users', userRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Oops we have a problem!');
});

// For local development
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
