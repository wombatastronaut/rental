import { Router } from 'express';
import { AgentController } from './controllers/agentController';

const router = Router();
const controller = new AgentController();

router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;