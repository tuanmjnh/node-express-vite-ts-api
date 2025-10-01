import { Router } from 'express';
import { uploadTemp } from './upload.config';
import { uploadToCloudinary } from './upload.service';
import { verifyToken } from '../../middlewares/authMiddleware';
import path from 'path';

const router = Router();

router.post('/single', verifyToken, uploadTemp.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file' });
  const provider = process.env.UPLOAD_PROVIDER ?? 'local';
  if (provider === 'cloudinary') {
    const info = await uploadToCloudinary(req.file.path);
    res.json({ ok: true, file: info });
  } else {
    const fileUrl = '/uploads/tmp/' + path.basename(req.file.path);
    res.json({ ok: true, file: { url: fileUrl } });
  }
});

export default router;

