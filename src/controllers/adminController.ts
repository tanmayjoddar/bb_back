import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import jwt from 'jsonwebtoken';

// Admin login
export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { password } = req.body;

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!password || !adminPassword || password !== adminPassword) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { role: 'admin' },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      token
    });
  } catch (err) {
    next(err);
  }
};

// Get all participants (admin only)
export const getAllParticipants = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const participants = await prisma.participant.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      participants: participants.map(p => ({
        id: p.id,
        name: p.name,
        email: p.email,
        phone: p.phone,
        college: p.college,
        code: p.code,
        createdAt: p.createdAt
      }))
    });
  } catch (err) {
    next(err);
  }
};

// Create round (admin only)
export const createRound = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400);
      throw new Error('Round name is required');
    }

    const round = await prisma.round.create({
      data: {
        name,
        status: 'pending'
      }
    });

    res.status(201).json({
      success: true,
      round: {
        id: round.id,
        name: round.name,
        status: round.status,
        createdAt: round.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
};

// Assign participant to round (admin only)
export const assignParticipantToRound = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { roundId } = req.params;
    const { participantId } = req.body;

    if (!participantId) {
      res.status(400);
      throw new Error('Participant ID is required');
    }

    // Check if participant exists
    const participant = await prisma.participant.findUnique({
      where: { id: participantId }
    });

    if (!participant) {
      res.status(404);
      throw new Error('Participant not found');
    }

    // Check if round exists
    const round = await prisma.round.findUnique({
      where: { id: roundId }
    });

    if (!round) {
      res.status(404);
      throw new Error('Round not found');
    }

    // Create participant-round mapping
    const participantRound = await prisma.participantRound.create({
      data: {
        participantId,
        roundId
      }
    });

    res.status(201).json({
      success: true,
      participantRound: {
        id: participantRound.id,
        participantId: participantRound.participantId,
        roundId: participantRound.roundId,
        status: participantRound.status,
        createdAt: participantRound.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
};
