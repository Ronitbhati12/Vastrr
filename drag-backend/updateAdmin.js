import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function updateAdmin() {
  try {
    console.log('Connecting to database...');
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('bhatironit', salt);

    // Delete existing admin@vastrr.com if exists to avoid confusion
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@vastrr.com' }
    });

    if (existingAdmin) {
      await prisma.user.delete({ where: { email: 'admin@vastrr.com' } });
    }

    // Upsert the new user
    await prisma.user.upsert({
      where: { email: 'ronitbhati12' },
      update: {
        password: hashedPassword,
        name: 'Ronit Bhati'
      },
      create: {
        name: 'Ronit Bhati',
        email: 'ronitbhati12',
        password: hashedPassword,
        role: 'Admin'
      }
    });

    console.log('✅ Admin user updated successfully! Username: ronitbhati12 | Password: bhatironit');
  } catch (error) {
    console.error('❌ Database Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdmin();
