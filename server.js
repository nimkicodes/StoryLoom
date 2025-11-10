import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import zineRoutes from './routes/zineRoutes.js';
import { connectDB } from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

connectDB().then(() => {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
  app.use(cors());
  app.use(express.json());

  app.use('/api/zines', zineRoutes);

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Oops we have a problem!');
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
