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

