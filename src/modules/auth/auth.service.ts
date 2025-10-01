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

