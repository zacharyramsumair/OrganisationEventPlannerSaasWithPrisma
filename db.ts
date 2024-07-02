import { PrismaClient } from '@prisma/client';

// Function to create a new PrismaClient instance
const prismaClientSingleton = () => {
  return new PrismaClient();
}

// Declare globalThis with prismaGlobal
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

// Create a singleton PrismaClient instance
const db = globalThis.prismaGlobal ?? prismaClientSingleton();

// Set prismaGlobal to the singleton instance in non-production environments
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = db;

// Export the singleton instance
export { db };
