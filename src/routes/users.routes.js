import express from 'express';
import UserController from '../controllers/UserController.js';
import authenticate from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';

const router = express.Router();

// GET /api/users (solo el rol admin)
router.get('/', authenticate, authorize(['admin']), UserController.getAll);

// GET /api/users/me (cualquier usuario autenticado)
router.get('/me', authenticate, authorize([]), UserController.getMe);
router.put('/me', authenticate, authorize([]), UserController.updateMe);

// Gestión administrativa
router.get('/:id', authenticate, authorize(['admin']), UserController.getById);
router.put('/:id', authenticate, authorize(['admin']), UserController.updateById);
router.delete('/:id', authenticate, authorize(['admin']), UserController.deleteById);

export default router;