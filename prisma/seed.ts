import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create a demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@profitstay.com' },
    update: {},
    create: {
      email: 'demo@profitstay.com',
      password: '$2a$10$XqZ8YZJ5Z5Z5Z5Z5Z5Z5ZeZ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', // demo123
      name: 'Demo User',
    },
  });

  // Create a demo property
  const demoProperty = await prisma.property.upsert({
    where: { id: 'demo-property' },
    update: {},
    create: {
      id: 'demo-property',
      name: 'Demo Hotel',
      totalRooms: 20,
      userId: demoUser.id,
    },
  });

  // Create Direct Channel
  const directChannel = await prisma.channel.create({
    data: {
      name: 'Direct Booking',
      type: 'direct',
      propertyId: demoProperty.id,
      deductionSequence: {
        create: {
          components: {
            create: [
              { name: 'Payment Fee', type: 'percentage', value: 2.5, enabled: true, order: 0 },
              { name: 'Tax', type: 'percentage', value: 10, enabled: true, order: 1 },
            ],
          },
        },
      },
    },
  });

  // Create Agoda Channel Template
  const agodaChannel = await prisma.channel.create({
    data: {
      name: 'Agoda',
      type: 'ota',
      propertyId: demoProperty.id,
      deductionSequence: {
        create: {
          components: {
            create: [
              { name: 'OTA Commission', type: 'percentage', value: 18, enabled: true, order: 0 },
              { name: 'Discount', type: 'percentage', value: 0, enabled: false, order: 1 },
              { name: 'Voucher', type: 'percentage', value: 0, enabled: false, order: 2 },
              { name: 'Payment Fee', type: 'percentage', value: 2.5, enabled: true, order: 3 },
              { name: 'Tax', type: 'percentage', value: 10, enabled: true, order: 4 },
            ],
          },
        },
      },
    },
  });

  // Create Booking.com Channel Template
  const bookingChannel = await prisma.channel.create({
    data: {
      name: 'Booking.com',
      type: 'ota',
      propertyId: demoProperty.id,
      deductionSequence: {
        create: {
          components: {
            create: [
              { name: 'OTA Commission', type: 'percentage', value: 15, enabled: true, order: 0 },
              { name: 'Discount', type: 'percentage', value: 0, enabled: false, order: 1 },
              { name: 'Voucher', type: 'percentage', value: 0, enabled: false, order: 2 },
              { name: 'Payment Fee', type: 'percentage', value: 2.5, enabled: true, order: 3 },
              { name: 'Tax', type: 'percentage', value: 10, enabled: true, order: 4 },
            ],
          },
        },
      },
    },
  });

  // Create Traveloka Channel Template
  const travelokaChannel = await prisma.channel.create({
    data: {
      name: 'Traveloka',
      type: 'ota',
      propertyId: demoProperty.id,
      deductionSequence: {
        create: {
          components: {
            create: [
              { name: 'OTA Commission', type: 'percentage', value: 20, enabled: true, order: 0 },
              { name: 'Discount', type: 'percentage', value: 0, enabled: false, order: 1 },
              { name: 'Voucher', type: 'percentage', value: 0, enabled: false, order: 2 },
              { name: 'Payment Fee', type: 'percentage', value: 2.5, enabled: true, order: 3 },
              { name: 'Tax', type: 'percentage', value: 10, enabled: true, order: 4 },
            ],
          },
        },
      },
    },
  });

  // Create Tiket Channel Template
  const tiketChannel = await prisma.channel.create({
    data: {
      name: 'Tiket',
      type: 'ota',
      propertyId: demoProperty.id,
      deductionSequence: {
        create: {
          components: {
            create: [
              { name: 'OTA Commission', type: 'percentage', value: 17, enabled: true, order: 0 },
              { name: 'Discount', type: 'percentage', value: 0, enabled: false, order: 1 },
              { name: 'Voucher', type: 'percentage', value: 0, enabled: false, order: 2 },
              { name: 'Payment Fee', type: 'percentage', value: 2.5, enabled: true, order: 3 },
              { name: 'Tax', type: 'percentage', value: 10, enabled: true, order: 4 },
            ],
          },
        },
      },
    },
  });

  // Create sample scenarios
  console.log('Creating sample scenarios...');
  const scenarios = [
    {
      name: 'Standard Weekly agoda',
      sellingPrice: 1500000,
      operationalCost: 200000,
      netRevenue: 1230000,
      netProfit: 1030000,
      profitMargin: 68.6,
      channelId: agodaChannel.id,
    },
    {
      name: 'Direct Weekend',
      sellingPrice: 1800000,
      operationalCost: 250000,
      netRevenue: 1755000,
      netProfit: 1505000,
      profitMargin: 83.6,
      channelId: directChannel.id,
    },
    {
      name: 'Booking.com Promo',
      sellingPrice: 1200000,
      operationalCost: 150000,
      netRevenue: 1020000,
      netProfit: 870000,
      profitMargin: 72.5,
      channelId: bookingChannel.id,
    }
  ];

  for (const s of scenarios) {
    await prisma.scenario.create({
      data: {
        ...s,
        userId: demoUser.id,
        propertyId: demoProperty.id,
      }
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log('Demo user:', demoUser.email);
  console.log('Channels created:', 5);
  console.log('Scenarios created:', scenarios.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
