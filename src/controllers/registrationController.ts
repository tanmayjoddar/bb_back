import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db.js";
import { generateQRDataUrl, generateQRFile } from "../utils/qrGenerator.js";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  8
);

export const registerParticipant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, phone, college } = req.body;

    if (!name || !email) {
      res.status(400);
      throw new Error("Name and email are required");
    }

    const existing = await prisma.participant.findUnique({ where: { email } });
    if (existing) {
      res.status(400);
      throw new Error("Email already registered");
    }

    // Generate unique code
    let code: string;
    let isUnique = false;
    while (!isUnique) {
      code = nanoid();
      const existingCode = await prisma.participant.findUnique({
        where: { code },
      });
      if (!existingCode) {
        isUnique = true;
      }
    }

    const participant = await prisma.participant.create({
      data: {
        name,
        email,
        phone,
        college,
        code: code!,
        qrCode: "",
      },
    });

    const qrDataUrl = await generateQRDataUrl(participant);
    const qrFilePath = await generateQRFile(participant);

    await prisma.participant.update({
      where: { id: participant.id },
      data: { qrCode: qrFilePath },
    });

    res.status(201).json({
      success: true,
      participant: {
        id: participant.id,
        name: participant.name,
        email: participant.email,
        phone: participant.phone,
        college: participant.college,
        code: participant.code,
        createdAt: participant.createdAt,
      },
      qrDataUrl,
    });
  } catch (err) {
    next(err);
  }
};

// Get participant by code
export const getParticipantByCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code } = req.params;

    const participant = await prisma.participant.findUnique({
      where: { code },
    });

    if (!participant) {
      res.status(404);
      throw new Error("Participant not found");
    }

    res.status(200).json({
      success: true,
      participant: {
        id: participant.id,
        name: participant.name,
        email: participant.email,
        phone: participant.phone,
        college: participant.college,
        code: participant.code,
        createdAt: participant.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Scan QR code
export const scanQR = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code, payload } = req.body;

    let participantCode: string;

    if (code) {
      // Code provided directly
      participantCode = code;
    } else if (payload) {
      // Extract code from payload
      try {
        const parsedPayload = JSON.parse(payload);
        participantCode = parsedPayload.code;
      } catch (err) {
        res.status(400);
        throw new Error("Invalid payload format");
      }
    } else {
      res.status(400);
      throw new Error("Either code or payload is required");
    }

    const participant = await prisma.participant.findUnique({
      where: { code: participantCode },
    });

    if (!participant) {
      res.status(404);
      throw new Error("Participant not found");
    }

    res.status(200).json({
      success: true,
      participant: {
        id: participant.id,
        name: participant.name,
        email: participant.email,
        phone: participant.phone,
        college: participant.college,
        code: participant.code,
        createdAt: participant.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Serve QR code image
export const serveQRCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code } = req.params;

    // Verify participant exists
    const participant = await prisma.participant.findUnique({
      where: { code },
    });

    if (!participant) {
      res.status(404);
      throw new Error("Participant not found");
    }

    // Generate QR code image
    const { generateQRFile } = await import("../utils/qrGenerator.js");
    const qrFilePath = await generateQRFile(participant);

    // Send the QR code image
    res.sendFile(process.cwd() + qrFilePath);
  } catch (err) {
    next(err);
  }
};
