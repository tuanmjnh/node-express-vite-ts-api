import { Request, Response } from 'express';
import { RoleModel } from './role.model';

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

