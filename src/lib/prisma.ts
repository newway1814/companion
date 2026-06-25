import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";
import { loadServerConfig } from "@/lib/config";

// Prisma 7 connects through a driver adapter rather than a schema `url`.
// The app uses the pooled (PgBouncer) connection for runtime queries.
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient(): PrismaClient {
  const { databaseUrl } = loadServerConfig();
  const adapter = new PrismaPg({ connectionString: databaseUrl });
  return new PrismaClient({ adapter });
}

function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

// Lazy proxy: the client (and its env validation) is constructed on first use
// at request time, not at module load — so `next build` needs no DB secrets.
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = client[prop as keyof PrismaClient];
    // Bind methods (e.g. $transaction) so `this` is the real client, not the
    // proxy — Prisma relies on private fields that the proxy can't forward.
    return typeof value === "function" ? value.bind(client) : value;
  },
});
