import express from 'express';
import {
  registerParticipant,
  getParticipantByCode,
  scanQR,
  serveQRCode
} from '../controllers/registrationController.js';

const router = express.Router();

// Participant registration
router.post('/', registerParticipant);

// Get participant by code
router.get('/:code', getParticipantByCode);

// Scan QR code
router.post('/scan', scanQR);

// Serve QR code image
router.get('/qr/:code', serveQRCode);

export default router;
