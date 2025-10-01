import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { verifyToken } from '../../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/me', verifyToken, AuthController.me);

export default router;

