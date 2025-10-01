import { Router } from 'express';
import { RoleController } from './role.controller';
import { verifyToken } from '../../middlewares/authMiddleware';

const router = Router();

router.get('/', verifyToken, RoleController.list);
router.post('/', verifyToken, RoleController.create);
router.put('/:id', verifyToken, RoleController.update);
router.delete('/:id', verifyToken, RoleController.remove);

export default router;

