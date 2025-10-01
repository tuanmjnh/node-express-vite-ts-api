import multer from 'multer';
import path from 'path';
import fs from 'fs';

const tmp = path.join(process.cwd(), 'uploads', 'tmp');
if (!fs.existsSync(tmp)) fs.mkdirSync(tmp, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, tmp),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

export const uploadTemp = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

