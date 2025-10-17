import express from 'express';
import {
  adminLogin,
  getAllParticipants,
  createRound,
  assignParticipantToRound
} from '../controllers/adminController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', adminLogin);

// Protected routes
router.get('/participants', authenticateAdmin, getAllParticipants);
router.post('/rounds', authenticateAdmin, createRound);
router.post('/rounds/:roundId/assign', authenticateAdmin, assignParticipantToRound);

export default router;
