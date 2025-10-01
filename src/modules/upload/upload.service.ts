import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function uploadToCloudinary(filepath: string, folder = 'uploads') {
  const res = await cloudinary.uploader.upload(filepath, { folder, resource_type: 'auto' });
  try { fs.unlinkSync(filepath); } catch { }
  return { public_id: res.public_id, url: res.secure_url, type: res.resource_type, size: res.bytes, created_at: res.created_at };
}

