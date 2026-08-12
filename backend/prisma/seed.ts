import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing data (order matters due to foreign keys)
  await prisma.harvest.deleteMany();
  await prisma.reading.deleteMany();
  await prisma.batch.deleteMany();
  await prisma.channel.deleteMany();

  const channelA = await prisma.channel.create({
    data: { name: "Channel A", capacity: 12, status: "active" },
  });
  const channelB = await prisma.channel.create({
    data: { name: "Channel B", capacity: 12, status: "active" },
  });
  const channelC = await prisma.channel.create({
    data: { name: "Channel C", capacity: 8, status: "active" },
  });
  await prisma.channel.create({
    data: { name: "Channel D", capacity: 8, status: "empty" },
  });

  const lettuce = await prisma.batch.create({
    data: {
      cropType: "Lettuce",
      plantedDate: new Date("2026-07-12"),
      expectedHarvestDate: new Date("2026-08-16"),
      status: "growing",
      channelId: channelA.id,
    },
  });

  const basil = await prisma.batch.create({
    data: {
      cropType: "Basil",
      plantedDate: new Date("2026-07-18"),
      expectedHarvestDate: new Date("2026-08-22"),
      status: "germinating",
      channelId: channelB.id,
    },
  });

  const kale = await prisma.batch.create({
    data: {
      cropType: "Kale",
      plantedDate: new Date("2026-06-30"),
      expectedHarvestDate: new Date("2026-08-04"),
      status: "harvested",
      channelId: channelC.id,
    },
  });

  await prisma.reading.createMany({
    data: [
      {
        date: new Date("2026-07-20"),
        pH: 6.1,
        ec: 1.8,
        waterTemp: 22,
        notes: "Normal",
        batchId: lettuce.id,
      },
      {
        date: new Date("2026-07-22"),
        pH: 6.3,
        ec: 1.7,
        waterTemp: 21.5,
        notes: null,
        batchId: lettuce.id,
      },
      {
        date: new Date("2026-07-24"),
        pH: 5.9,
        ec: 1.9,
        waterTemp: 22.5,
        notes: "Topped up nutrients",
        batchId: lettuce.id,
      },
      {
        date: new Date("2026-07-19"),
        pH: 6.0,
        ec: 1.5,
        waterTemp: 23,
        notes: null,
        batchId: basil.id,
      },
      {
        date: new Date("2026-07-15"),
        pH: 6.2,
        ec: 2.0,
        waterTemp: 22,
        notes: null,
        batchId: kale.id,
      },
    ],
  });

  await prisma.harvest.create({
    data: {
      harvestDate: new Date("2026-08-04"),
      yieldKg: 2.4,
      notes: "Slightly early harvest",
      batchId: kale.id,
    },
  });

  console.log("Seed complete: 4 channels, 3 batches, 5 readings, 1 harvest.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
