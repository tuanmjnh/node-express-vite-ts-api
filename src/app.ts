import express from 'express';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser';
import path from 'path';

import authRoutes from '@modules/auth/auth.route';
import userRoutes from '@modules/user/user.route';
import uploadRoutes from '@modules/upload/upload.route';
import roleRoutes from '@modules/role/role.route';
import groupRoutes from '@modules/group/group.route';

import { errorHandler } from './middlewares/errorHandler';

const app = express();
app.use(cors());
app.use(compression());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/groups', groupRoutes);
app.use(process.env.BASE_URL || '/', function (req, res, next) {
  // const a = io.getDirectories({ root: process.env.ROOT_PATH, dir: '/' })
  let rs = `node-express-vite-ts-api\r\n`
  rs = `${rs}Mode: ${process.env.NODE_ENV}\r\n`
  res.end(rs)
})
app.use((_req, res) => res.status(404).json({ message: 'Not Found' }));
app.use(errorHandler);

export default app;

