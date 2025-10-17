import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

// Ensure qrcodes directory exists
const qrcodesDir = path.join(process.cwd(), 'qrcodes');
if (!fs.existsSync(qrcodesDir)) {
  fs.mkdirSync(qrcodesDir, { recursive: true });
}

export const generateQRDataUrl = async (participant: any) => {
  // Create JSON payload with id, code, name
  const qrPayload = {
    id: participant.id,
    code: participant.code,
    name: participant.name
  };

  // Generate QR code as data URL
  const qrDataUrl = await QRCode.toDataURL(JSON.stringify(qrPayload));
  return qrDataUrl;
};

// Generate QR code as file and return the file path
export const generateQRFile = async (participant: any) => {
  // Create JSON payload with id, code, name
  const qrPayload = {
    id: participant.id,
    code: participant.code,
    name: participant.name
  };

  const fileName = `${participant.code}.png`;
  const filePath = path.join(qrcodesDir, fileName);

  await QRCode.toFile(filePath, JSON.stringify(qrPayload));
  return `/qrcodes/${fileName}`;
};

// Get QR code file path
export const getQRFilePath = (code: string) => {
  const fileName = `${code}.png`;
  const filePath = path.join(qrcodesDir, fileName);
  return filePath;
};
