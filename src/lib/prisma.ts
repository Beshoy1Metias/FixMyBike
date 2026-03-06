import { PrismaClient } from "@prisma/client";

// Prevent multiple instances of Prisma Client in development
declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

function getPrismaClient(): PrismaClient {
    if (globalThis.prisma) {
        return globalThis.prisma;
    }
    const client = new PrismaClient();
    if (process.env.NODE_ENV !== "production") {
        globalThis.prisma = client;
    }
    return client;
}

const prisma = getPrismaClient();

export default prisma;
