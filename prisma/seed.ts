import { PrismaClient } from '@prisma/client';
import { customAlphabet } from 'nanoid';
import { generateQRDataUrl, generateQRFile } from '../src/utils/qrGenerator.js';

const prisma = new PrismaClient();
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

async function main() {
  console.log('Seeding database...');
  
  // Create sample participants
  const participantsData = [
    {
      name: 'Tanmay Bhattacharya',
      email: 'tanmay@example.com',
      phone: '9999999999',
      college: 'Indian Institute of Technology'
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '8888888888',
      college: 'Stanford University'
    },
    {
      name: 'Michael Chen',
      email: 'michael@example.com',
      phone: '7777777777',
      college: 'MIT'
    },
    {
      name: 'Emma Wilson',
      email: 'emma@example.com',
      phone: '6666666666',
      college: 'Harvard University'
    },
    {
      name: 'David Rodriguez',
      email: 'david@example.com',
      phone: '5555555555',
      college: 'University of Cambridge'
    }
  ];

  for (const participantData of participantsData) {
    // Generate unique code
    let code: string = '';
    let isUnique = false;
    while (!isUnique) {
      code = nanoid();
      const existingCode = await prisma.participant.findUnique({ where: { code } });
      if (!existingCode) {
        isUnique = true;
      }
    }

    // Create participant
    const participant = await prisma.participant.create({
      data: {
        name: participantData.name,
        email: participantData.email,
        phone: participantData.phone,
        college: participantData.college,
        code: code,
        qrCode: ''
      }
    });

    // Generate QR codes
    const qrDataUrl = await generateQRDataUrl(participant);
    const qrFilePath = await generateQRFile(participant);
    
    // Update participant with QR code path
    await prisma.participant.update({
      where: { id: participant.id },
      data: { qrCode: qrFilePath }
    });

    console.log(`Created participant: ${participant.name} with code: ${participant.code}`);
  }

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });