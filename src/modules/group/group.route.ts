import { Router } from 'express';
import { GroupController } from './group.controller';
import { verifyToken } from '../../middlewares/authMiddleware';

const router = Router();

router.get('/', verifyToken, GroupController.list);
router.post('/', verifyToken, GroupController.create);
router.put('/:id', verifyToken, GroupController.update);
router.delete('/:id', verifyToken, GroupController.remove);

export default router;

