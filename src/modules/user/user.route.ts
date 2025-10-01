import { Router } from 'express';
import { UserController } from './user.controller';
import { verifyToken } from '../../middlewares/authMiddleware';
import { uploadTemp } from '@modules/upload/upload.config';

const router = Router();

router.get('/', verifyToken, UserController.list);
router.get('/:id', verifyToken, UserController.get);
router.post('/', UserController.create);
router.put('/:id', verifyToken, UserController.update);
router.delete('/:id', verifyToken, UserController.remove);

// upload avatars (max 10)
router.post('/:id/avatars', verifyToken, uploadTemp.array('avatars', 10), UserController.uploadAvatars);

export default router;

