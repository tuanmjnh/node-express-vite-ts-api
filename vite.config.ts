import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@modules': path.resolve(__dirname, 'src/modules'),
      '@interfaces': path.resolve(__dirname, 'interfaces')
    }
  },
  build: {
    target: 'node18',
    outDir: 'dist',
    rollupOptions: {
      input: 'src/main.ts',
      external: [
        'express', 'mongoose', 'jsonwebtoken', 'bcrypt', 'cors', 'compression', 'cloudinary', 'multer', 'dotenv'
      ]
    }
  }
});

