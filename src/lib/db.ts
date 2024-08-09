import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

export const db = globalThis.prisma || new PrismaClient();

// em dev acontece o hot reload e isso previne que gere uma instância nova do prisma 
// evitando o esgotamento de recursos da aplicação
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
