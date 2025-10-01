import { Document, Schema, model } from 'mongoose';

export interface RoleDocument extends Models.Role, Document { }
const roleSchema = new Schema<RoleDocument>({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  desc: String,
  level: { type: Number, default: 1 },
  color: { type: String, default: '#027be3' },
  routes: { type: [String], default: [] },
  flag: { type: Number, default: 1 },
  created: { type: Object, default: { at: Date.now(), by: 'system', ip: '' } }
});

export const RoleModel = model<RoleDocument>('Role', roleSchema);

