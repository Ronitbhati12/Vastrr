import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('Connecting to database...');

    // Clear existing data (in correct order of dependencies)
    console.log('Clearing existing database records...');
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.collection.deleteMany({});
    await prisma.user.deleteMany({});

    // Seed Admin
    console.log('Creating Admin user...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('bhatironit', salt);

    const adminUser = await prisma.user.create({
      data: {
        name: 'Ronit Bhati',
        email: 'ronitbhati12',
        password: hashedPassword,
        role: 'Admin'
      }
    });
    console.log(`✅ Admin created: ${adminUser.email}`);

    // Seed Collections
    console.log('Creating Collections...');
    const voidLab = await prisma.collection.create({
      data: {
        name: 'VOID LAB',
        description: 'Heavyweight t-shirts, brutalist graphic tees, and streetwear essentials engineered in silence.',
        coverImage: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=600',
        status: 'Active'
      }
    });

    const shadowTailor = await prisma.collection.create({
      data: {
        name: 'SHADOW TAILOR',
        description: 'Dystopian jackets, tech hoodies, and weather-proof outerwear built for the urban landscape.',
        coverImage: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=600',
        status: 'Active'
      }
    });

    const noirAccessories = await prisma.collection.create({
      data: {
        name: 'NOIR ACCESSORIES',
        description: 'Tactical chest rigs, monospace embroidered headwear, and modular gear.',
        coverImage: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=600',
        status: 'Active'
      }
    });
    console.log('✅ Collections seeded.');

    // Seed Products
    console.log('Creating Products...');
    
    // VOID LAB Products
    await prisma.product.createMany({
      data: [
        {
          name: 'VASTRR OVERSIZED VOID TEE',
          material: '100% Organic Heavyweight Cotton',
          price: 2900.0,
          discountRate: 0,
          image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600',
          colorCode: '#0F0F0F',
          collectionId: voidLab.id,
          inStock: true
        },
        {
          name: 'INDUSTRIAL CARGO UTILITY TEE',
          material: 'Ripstop Cotton Blend',
          price: 3400.0,
          discountRate: 10,
          image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=600',
          colorCode: '#2A2E33',
          collectionId: voidLab.id,
          inStock: true
        },
        {
          name: 'DECRYPTED SCRAMBLE GRAPHIC TEE',
          material: 'French Terry Cotton',
          price: 3100.0,
          discountRate: 0,
          image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600',
          colorCode: '#1E1E24',
          collectionId: voidLab.id,
          inStock: true
        }
      ]
    });

    // SHADOW TAILOR Products
    await prisma.product.createMany({
      data: [
        {
          name: 'DYSTOPIAN SHIELD FISHTAIL PARKA',
          material: 'Gore-Tex Waterproof Nylon',
          price: 12900.0,
          discountRate: 15,
          image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=600',
          colorCode: '#0C0F0C',
          collectionId: shadowTailor.id,
          inStock: true
        },
        {
          name: 'DECRYPTED SHADOW CARGO HOODIE',
          material: '450GSM Loopback Terry',
          price: 7200.0,
          discountRate: 0,
          image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600',
          colorCode: '#18181B',
          collectionId: shadowTailor.id,
          inStock: true
        },
        {
          name: 'TACTICAL VOID HOODED BOMBER',
          material: 'DWR Technical Shell',
          price: 9500.0,
          discountRate: 5,
          image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600',
          colorCode: '#242528',
          collectionId: shadowTailor.id,
          inStock: true
        }
      ]
    });

    // NOIR ACCESSORIES Products
    await prisma.product.createMany({
      data: [
        {
          name: 'VAULT COMMAND TACTICAL CHEST RIG',
          material: '1000D Cordura Nylon',
          price: 4500.0,
          discountRate: 0,
          image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=600',
          colorCode: '#17181A',
          collectionId: noirAccessories.id,
          inStock: true
        },
        {
          name: 'MONOSPACE EMBROIDERED CYBER CAP',
          material: 'Twill Canvas Cotton',
          price: 1900.0,
          discountRate: 0,
          image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600',
          colorCode: '#0A0A0B',
          collectionId: noirAccessories.id,
          inStock: true
        },
        {
          name: 'THERMO TACTICAL WAFFLE BEANIE',
          material: 'Insulated Ribbed Knit',
          price: 1500.0,
          discountRate: 0,
          image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=600',
          colorCode: '#323336',
          collectionId: noirAccessories.id,
          inStock: true
        }
      ]
    });
    console.log('✅ Products seeded successfully.');
    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Database Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
