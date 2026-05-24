import express from 'express';
import { getAnalyticsSummary } from '../controllers/analyticsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/summary').get(protect, admin, getAnalyticsSummary);

export default router;
