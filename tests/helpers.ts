import prisma from "../src/config/database";

export async function cleanDb() {
  await prisma.console.deleteMany({});
  await prisma.game.deleteMany({});
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
}
