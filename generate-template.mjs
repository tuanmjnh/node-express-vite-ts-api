#!/usr/bin/env node
import fs from "fs";
import path from "path";

const root = process.cwd();
const projectName = "node-express-vite-ts-api";
const baseDir = path.join(root, projectName);

function createDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}
function writeFile(filePath, content) {
  createDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content.trimStart() + "\n", "utf8");
  console.log("📝 Created:", filePath.replace(root + path.sep, ""));
}

// ---------------------------------------------------------------------------
// 1. package.json
// ---------------------------------------------------------------------------
writeFile(
  path.join(baseDir, "package.json"),
  `
{
  "name": "${projectName}",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite-node --tsconfig tsconfig.json src/main.ts",
    "build": "vite build",
    "start": "node dist/main.js"
  },
  "dependencies": {
    "bcrypt": "^5.1.0",
    "body-parser": "^1.20.3",
    "cloudinary": "^2.5.0",
    "compression": "^1.7.4",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.1",
    "joi": "^17.9.2",
    "jsonwebtoken": "^9.0.0",
    "moment": "^2.30.1",
    "mongoose": "^8.8.2",
    "multer": "^1.4.5-lts.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.2",
    "@types/mongoose": "^5.11.97",
    "@types/multer": "^1.4.7",
    "@types/node": "^18.16.19",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.6.3",
    "vite": "^5.0.0",
    "vite-node": "^1.0.0"
  }
}
`
);

// ---------------------------------------------------------------------------
// 2. vite.config.ts
// ---------------------------------------------------------------------------
writeFile(
  path.join(baseDir, "vite.config.ts"),
  `
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
`
);

// ---------------------------------------------------------------------------
// 3. tsconfig.json
// ---------------------------------------------------------------------------
writeFile(
  path.join(baseDir, "tsconfig.json"),
  `
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Node",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@config/*": ["src/config/*"],
      "@modules/*": ["src/modules/*"],
      "@interfaces/*": ["interfaces/*"]
    }
  },
  "include": ["src/**/*", "interfaces/**/*"],
  "exclude": ["node_modules", "dist"]
}
`
);

// ---------------------------------------------------------------------------
// 4. .env.example
// ---------------------------------------------------------------------------
writeFile(
  path.join(baseDir, ".env.example"),
  `
PORT=3000
MONGO_URI=mongodb://localhost:27017/mydb
JWT_SECRET=changeme
UPLOAD_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
`
);

// ---------------------------------------------------------------------------
// 5. Entry main.ts + app.ts
// ---------------------------------------------------------------------------
writeFile(
  path.join(baseDir, "src/main.ts"),
  `
import 'dotenv/config';
import app from './app.js';
import { connectDB } from '@config/database.js';
import { seedDatabase } from '@config/seed.js';

const PORT = Number(process.env.PORT ?? 3000);

(async () => {
  await connectDB();
  await seedDatabase();
  app.listen(PORT, () => console.log(\`🚀 Server running on http://localhost:\${PORT}\`));
})();
`
);

writeFile(
  path.join(baseDir, "src/app.ts"),
  `
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
`
);

// ---------------------------------------------------------------------------
// 6. Database + Seeder
// ---------------------------------------------------------------------------
writeFile(
  path.join(baseDir, "src/config/database.ts"),
  `
import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGO_URI ?? 'mongodb://localhost:27017/mydb';
  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed', err);
    process.exit(1);
  }
}
`
);

// ---------------------------------------------------------------------------
// 7. Error handler middleware
// ---------------------------------------------------------------------------
writeFile(
  path.join(baseDir, "src/middlewares/errorHandler.ts"),
  `
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  const message = err instanceof Error ? err.message : 'Internal Server Error';
  res.status(err?.status || 500).json({ message });
};
`
);

// ---------------------------------------------------------------------------
// 8. Auth middleware (JWT verify)
// ---------------------------------------------------------------------------
writeFile(
  path.join(baseDir, "src/middlewares/authMiddleware.ts"),
  `
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET ?? 'changeme';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Missing token' });
  const token = header.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
`
);

// ---------------------------------------------------------------------------
// 9. Interfaces
// ---------------------------------------------------------------------------
writeFile(
  path.join(baseDir, "interfaces/common.d.ts"),
  `
export {};

declare namespace Models {
  interface ICreated {
    at: number;
    by?: string;
    ip?: string;
  }

  interface IFileAttach {
    _id?: string;
    public_id?: string;
    url: string;
    type?: string;
    size?: number;
    created_at?: number;
  }
}
`
);

writeFile(
  path.join(baseDir, "interfaces/IUser.d.ts"),
  `
export {};

declare namespace Models {
  interface IUser {
    _id?: string;
    account: string;
    password: string;
    salt?: string;
    name: string;
    email: string;
    phone?: string;
    group?: string;
    roles?: string[];
    avatars?: IFileAttach[];
    verified?: boolean;
    status?: 'active' | 'inactive' | 'banned';
    createdAt?: number;
    updatedAt?: number;
  }
}
`
);

writeFile(
  path.join(baseDir, "interfaces/IRole.d.ts"),
  `
export {};

declare namespace Models {
  interface IRole {
    _id?: string;
    key: string;
    name: string;
    desc?: string;
    level?: number;
    color?: string;
    routes?: string[];
    flag?: number;
    created?: ICreated;
  }
}
`
);

writeFile(
  path.join(baseDir, "interfaces/IGroup.d.ts"),
  `
export {};

declare namespace Models {
  interface IGroup {
    _id?: string;
    type: string;
    code: string;
    title: string;
    desc?: string;
    level?: number;
    color?: string;
    flag?: number;
    created?: ICreated;
  }
}
`
);

// ---------------------------------------------------------------------------
// 10. User model
// ---------------------------------------------------------------------------
writeFile(
  path.join(baseDir, "src/modules/user/user.model.ts"),
  `
import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const fileSchema = new Schema({
  public_id: String,
  url: { type: String, required: true },
  type: String,
  size: Number,
  created_at: { type: Number, default: () => Date.now() }
}, { _id: false });

const userSchema = new Schema({
  account: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  salt: { type: String, select: false },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  group: String,
  roles: { type: [String], default: [] },
  avatars: { type: [fileSchema], default: [] },
  verified: { type: Boolean, default: false },
  status: { type: String, enum: ['active','inactive','banned'], default: 'active' },
  createdAt: { type: Number, default: () => Date.now() },
  updatedAt: { type: Number, default: () => Date.now() }
});

userSchema.pre('save', async function(next) {
  const user = this as any;
  if (!user.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  user.salt = salt;
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

export const UserModel = model('User', userSchema);
`
);

// ---------------------------------------------------------------------------
// 11. Role model
// ---------------------------------------------------------------------------
writeFile(
  path.join(baseDir, "src/modules/role/role.model.ts"),
  `
import { Schema, model } from 'mongoose';

const roleSchema = new Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  desc: String,
  level: { type: Number, default: 1 },
  color: { type: String, default: '#027be3' },
  routes: { type: [String], default: [] },
  flag: { type: Number, default: 1 },
  created: { type: Object, default: { at: Date.now(), by: 'system', ip: '' } }
});

export const RoleModel = model('Role', roleSchema);
`
);

// ---------------------------------------------------------------------------
// 12. Group model
// ---------------------------------------------------------------------------
writeFile(
  path.join(baseDir, "src/modules/group/group.model.ts"),
  `
import { Schema, model } from 'mongoose';

const groupSchema = new Schema({
  type: { type: String, required: true },
  code: { type: String, required: true, uppercase: true },
  title: { type: String, required: true },
  desc: String,
  level: { type: Number, default: 1 },
  color: { type: String, default: '#999' },
  flag: { type: Number, default: 1 },
  created: { type: Object, default: { at: Date.now(), by: 'system', ip: '' } }
});

export const GroupModel = model('Group', groupSchema);
`
);

// ---------------------------------------------------------------------------
// 13. Upload config + service + route
// ---------------------------------------------------------------------------
writeFile(
  path.join(baseDir, "src/modules/upload/upload.config.ts"),
  `
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
`
);

writeFile(
  path.join(baseDir, "src/modules/upload/upload.service.ts"),
  `
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function uploadToCloudinary(filepath: string, folder = 'uploads') {
  const res = await cloudinary.uploader.upload(filepath, { folder, resource_type: 'auto' });
  try { fs.unlinkSync(filepath); } catch {}
  return { public_id: res.public_id, url: res.secure_url, type: res.resource_type, size: res.bytes };
}
`
);

writeFile(
  path.join(baseDir, "src/modules/upload/upload.route.ts"),
  `
import { Router } from 'express';
import { uploadTemp } from './upload.config.js';
import { uploadToCloudinary } from './upload.service.js';
import { verifyToken } from '../../middlewares/authMiddleware.js';
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
`
);

// ---------------------------------------------------------------------------
// 14. Auth: service, controller, route
// ---------------------------------------------------------------------------
writeFile(
  path.join(baseDir, "src/modules/auth/auth.service.ts"),
  `
import jwt from 'jsonwebtoken';
import { UserModel } from '@modules/user/user.model.js';
const JWT_SECRET = process.env.JWT_SECRET ?? 'changeme';
const JWT_EXPIRES = '1d';

export const AuthService = {
  async register(data: any) {
    const exists = await UserModel.findOne({ account: data.account });
    if (exists) throw new Error('Account already exists');
    const u = new UserModel({
      account: data.account,
      password: data.password,
      name: data.name,
      email: data.email,
      group: data.group ?? null
    });
    await u.save();
    // remove sensitive fields
    const user = await UserModel.findById(u._id).select('-password -salt');
    return { user };
  },

  async login(data: any) {
    const user = await UserModel.findOne({ account: data.account }).select('+password +salt');
    if (!user) throw new Error('Invalid credentials');

    // validate password (bcrypt)
    const bcrypt = await import('bcrypt');
    let match = false;
    if (user.salt) {
      // hash with salt
      const hashed = await bcrypt.hash(data.password, user.salt);
      match = hashed === user.password;
    } else {
      match = await bcrypt.compare(data.password, user.password);
    }

    if (!match) throw new Error('Invalid credentials');

    const payload = { id: user._id, account: user.account, roles: user.roles, group: user.group };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    await UserModel.findByIdAndUpdate(user._id, { lastLogin: Date.now() });

    const safeUser = await UserModel.findById(user._id).select('-password -salt');
    return { token, user: safeUser };
  },

  verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
  }
};
`
);

writeFile(
  path.join(baseDir, "src/modules/auth/auth.controller.ts"),
  `
import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';

export const AuthController = {
  async register(req: Request, res: Response) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json(result);
    } catch (err: any) {
      const message = err instanceof Error ? err.message : 'error';
      res.status(400).json({ message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const result = await AuthService.login(req.body);
      res.json(result);
    } catch (err: any) {
      const message = err instanceof Error ? err.message : 'error';
      res.status(400).json({ message });
    }
  },

  async me(req: Request, res: Response) {
    res.json((req as any).user ?? null);
  }
};
`
);

writeFile(
  path.join(baseDir, "src/modules/auth/auth.route.ts"),
  `
import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { verifyToken } from '../../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/me', verifyToken, AuthController.me);

export default router;
`
);

// ---------------------------------------------------------------------------
// 15. User: controller & route
// ---------------------------------------------------------------------------
writeFile(
  path.join(baseDir, "src/modules/user/user.controller.ts"),
  `
import { Request, Response } from 'express';
import { UserModel } from './user.model.js';
import { uploadToCloudinary } from '@modules/upload/upload.service.js';
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
`
);

writeFile(
  path.join(baseDir, "src/modules/user/user.route.ts"),
  `
import { Router } from 'express';
import { UserController } from './user.controller.js';
import { verifyToken } from '../../middlewares/authMiddleware.js';
import { uploadTemp } from '@modules/upload/upload.config.js';

const router = Router();

router.get('/', verifyToken, UserController.list);
router.get('/:id', verifyToken, UserController.get);
router.post('/', UserController.create);
router.put('/:id', verifyToken, UserController.update);
router.delete('/:id', verifyToken, UserController.remove);

// upload avatars (max 10)
router.post('/:id/avatars', verifyToken, uploadTemp.array('avatars', 10), UserController.uploadAvatars);

export default router;
`
);

// ---------------------------------------------------------------------------
// 16. Role: controller & route
// ---------------------------------------------------------------------------
writeFile(
  path.join(baseDir, "src/modules/role/role.controller.ts"),
  `
import { Request, Response } from 'express';
import { RoleModel } from './role.model.js';

export const RoleController = {
  async list(_req: Request, res: Response) {
    const roles = await RoleModel.find();
    res.json(roles);
  },

  async create(req: Request, res: Response) {
    const r = new RoleModel(req.body);
    await r.save();
    res.status(201).json(r);
  },

  async update(req: Request, res: Response) {
    const r = await RoleModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(r);
  },

  async remove(req: Request, res: Response) {
    await RoleModel.findByIdAndDelete(req.params.id);
    res.status(204).send();
  }
};
`
);

writeFile(
  path.join(baseDir, "src/modules/role/role.route.ts"),
  `
import { Router } from 'express';
import { RoleController } from './role.controller.js';
import { verifyToken } from '../../middlewares/authMiddleware.js';

const router = Router();

router.get('/', verifyToken, RoleController.list);
router.post('/', verifyToken, RoleController.create);
router.put('/:id', verifyToken, RoleController.update);
router.delete('/:id', verifyToken, RoleController.remove);

export default router;
`
);

// ---------------------------------------------------------------------------
// 17. Group: controller & route
// ---------------------------------------------------------------------------
writeFile(
  path.join(baseDir, "src/modules/group/group.controller.ts"),
  `
import { Request, Response } from 'express';
import { GroupModel } from './group.model.js';

export const GroupController = {
  async list(_req: Request, res: Response) {
    const groups = await GroupModel.find();
    res.json(groups);
  },

  async create(req: Request, res: Response) {
    const g = new GroupModel(req.body);
    await g.save();
    res.status(201).json(g);
  },

  async update(req: Request, res: Response) {
    const g = await GroupModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(g);
  },

  async remove(req: Request, res: Response) {
    await GroupModel.findByIdAndDelete(req.params.id);
    res.status(204).send();
  }
};
`
);

writeFile(
  path.join(baseDir, "src/modules/group/group.route.ts"),
  `
import { Router } from 'express';
import { GroupController } from './group.controller.js';
import { verifyToken } from '../../middlewares/authMiddleware.js';

const router = Router();

router.get('/', verifyToken, GroupController.list);
router.post('/', verifyToken, GroupController.create);
router.put('/:id', verifyToken, GroupController.update);
router.delete('/:id', verifyToken, GroupController.remove);

export default router;
`
);

// ---------------------------------------------------------------------------
// 18. Seeder: create roles, groups, admin user if not exist
// ---------------------------------------------------------------------------
writeFile(
  path.join(baseDir, "src/config/seed.ts"),
  `
import { RoleModel } from '@modules/role/role.model.js';
import { GroupModel } from '@modules/group/group.model.js';
import { UserModel } from '@modules/user/user.model.js';
import bcrypt from 'bcrypt';

export async function seedDatabase() {
  try {
    // roles
    const roles = [
      { key: 'admin.full', name: 'Administrator - full access', level: 10, routes: [], flag: 1 },
      { key: 'user.read', name: 'User - read', level: 1, routes: [], flag: 1 }
    ];
    for (const r of roles) {
      const ex = await RoleModel.findOne({ key: r.key });
      if (!ex) await RoleModel.create(r);
    }

    // groups
    const groups = [
      { type: 'system', code: 'ADMIN', title: 'Administrators' },
      { type: 'system', code: 'USER', title: 'Users' }
    ];
    for (const g of groups) {
      const ex = await GroupModel.findOne({ code: g.code });
      if (!ex) await GroupModel.create(g);
    }

    // admin user
    const adminAccount = 'admin';
    const adminEmail = 'admin@example.com';
    const adminPass = '123456';
    const existing = await UserModel.findOne({ account: adminAccount });
    if (!existing) {
      const salt = await bcrypt.genSalt(12);
      const hashed = await bcrypt.hash(adminPass, salt);
      const adminGroup = await GroupModel.findOne({ code: 'ADMIN' });
      const adminRole = await RoleModel.findOne({ key: 'admin.full' });
      const u = await UserModel.create({
        account: adminAccount,
        password: hashed,
        salt,
        name: 'Administrator',
        email: adminEmail,
        group: adminGroup ? adminGroup._id : null,
        roles: adminRole ? [adminRole._id] : []
      });
      console.log('Seeded admin user:', u.account);
    }
  } catch (err) {
    console.error('Seed error', err);
  }
}
`
);

// ---------------------------------------------------------------------------
// 19. README
// ---------------------------------------------------------------------------
writeFile(
  path.join(baseDir, "README.md"),
  `
# node-express-vite-ts-api

Generated template.

## Quick start

1. Install
\`\`\`
npm install
\`\`\`

2. Copy .env.example -> .env and fill values

3. Dev (hot reload)
\`\`\`
npm run dev
\`\`\`

4. Build + run
\`\`\`
npm run build
npm start
\`\`\`

API:
- /api/auth/login
- /api/auth/register
- /api/users
- /api/upload/single
`
);

console.log("✅ Part 3 written — full project script ready.");
console.log("");
console.log("To generate project run:");
console.log("  node generate-template.mjs");
console.log("");
console.log("Then:");
console.log("  cd node-express-vite-ts-api");
console.log("  npm install");
console.log("  npm run dev");
