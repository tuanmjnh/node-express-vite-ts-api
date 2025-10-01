import { Request, Response } from 'express';
import { UserModel } from './user.model';
import { uploadToCloudinary } from '@modules/upload/upload.service';
import path from 'path';

export const UserController = {
  async list(_req: Request, res: Response) {
    const users = await UserModel.find().select('-password -salt');
    res.json(users);
  },

  async get(req: Request, res: Response) {
    const u = await UserModel.findById(req.params.id).select('-password -salt');
    if (!u) return res.status(404).json({ message: 'User not found' });
    res.json(u);
  },

  async create(req: Request, res: Response) {
    try {
      const payload = req.body;
      const u = new UserModel(payload);
      await u.save();
      const user = await UserModel.findById(u._id).select('-password -salt');
      res.status(201).json(user);
    } catch (err: any) {
      const message = err instanceof Error ? err.message : 'error';
      res.status(400).json({ message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const u = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password -salt');
      if (!u) return res.status(404).json({ message: 'User not found' });
      res.json(u);
    } catch (err: any) {
      const message = err instanceof Error ? err.message : 'error';
      res.status(400).json({ message });
    }
  },

  async remove(req: Request, res: Response) {
    await UserModel.findByIdAndDelete(req.params.id);
    res.status(204).send();
  },

  // upload multiple avatars: uses uploadTemp in route, then push to avatars array
  async uploadAvatars(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const files = req.files as Express.Multer.File[] | undefined;
      if (!files || files.length === 0) return res.status(400).json({ message: 'No files' });

      const uploads: any[] = [];
      for (const f of files) {
        const provider = process.env.UPLOAD_PROVIDER ?? 'local';
        if (provider === 'cloudinary') {
          const meta = await uploadToCloudinary(f.path, 'avatars');
          uploads.push({
            public_id: meta.public_id || '',
            url: meta.url,
            type: meta.type,
            size: meta.size,
            created_at: meta.created_at ?? Date.now()
          });
        } else {
          const filename = path.basename(f.path);
          uploads.push({ url: '/uploads/tmp/' + filename, public_id: '', type: 'file', size: 0, created_at: Date.now() });
        }
      }

      const user = await UserModel.findByIdAndUpdate(id, { $push: { avatars: { $each: uploads } } }, { new: true }).select('-password -salt');
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json({ ok: true, avatars: user.avatars });
    } catch (err: any) {
      const message = err instanceof Error ? err.message : 'error';
      res.status(500).json({ message });
    }
  }
};

