import { Router } from 'express';
import {
  getMyPolicies,
  getPolicyById,
  purchasePolicy,
} from '../controllers/policy.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// All policy routes are protected — must be logged in
router.use(protect);

// POST /api/policies — buy a policy
router.post('/', purchasePolicy);

// GET /api/policies/my — get all my policies
router.get('/my', getMyPolicies);

// GET /api/policies/:id — get single policy
router.get('/:id', getPolicyById);

export default router;
