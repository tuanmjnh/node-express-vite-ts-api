import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import compression from 'compression';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectDB } from '@config/database';
import { seedDatabase } from '@config/seed';

const app = express();
app.use(cors());
app.use(compression());
app.use(bodyParser.json());

connectDB().then(async () => {
  await seedDatabase();
});

app.get('/', (_req, res) => res.send('Server is running 🚀'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ API running on port ${PORT}`));
