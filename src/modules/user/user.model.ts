import { Document, Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface TypesDocument extends Models.User, Document { }
const fileSchema = new Schema<Models.IFileAttach>({
  public_id: String,
  url: { type: String, required: true },
  type: String,
  size: Number,
  created_at: { type: Number, default: () => Date.now() }
}, { _id: false });

const userSchema: Schema<TypesDocument> = new Schema<TypesDocument>({
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
  status: { type: String, enum: ['active', 'inactive', 'banned'], default: 'active' },
  createdAt: { type: Number, default: () => Date.now() },
  updatedAt: { type: Number, default: () => Date.now() },
});

userSchema.pre('save', async function (next) {
  const user = this as any;
  if (!user.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  user.salt = salt;
  user.password = await bcrypt.hash(user.password, salt);
  next();
});
export const UserModel = model<TypesDocument>('User', userSchema);

