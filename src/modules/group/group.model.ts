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

