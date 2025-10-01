import express from 'express';
import cors from 'cors';
import compression from 'compression';
import bodyParser from 'body-parser';
import path from 'path';

import authRoutes from '@modules/auth/auth.route.js';
import userRoutes from '@modules/user/user.route.js';
import uploadRoutes from '@modules/upload/upload.route.js';
import roleRoutes from '@modules/role/role.route.js';
import groupRoutes from '@modules/group/group.route.js';

import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/groups', groupRoutes);

app.use((_req, res) => res.status(404).json({ message: 'Not Found' }));
app.use(errorHandler);

export default app;

