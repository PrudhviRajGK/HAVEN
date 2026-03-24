import { Router } from 'express';
import {
  getDashboard,
  getProfile,
  updateProfile,
} from '../controllers/worker.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);

// GET /api/workers/profile
router.get('/profile', getProfile);

// PATCH /api/workers/profile
router.patch('/profile', updateProfile);

// GET /api/workers/dashboard
router.get('/dashboard', getDashboard);

export default router;
