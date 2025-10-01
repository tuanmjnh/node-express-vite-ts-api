import { Request, Response } from 'express';
import { GroupModel } from './group.model';

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

