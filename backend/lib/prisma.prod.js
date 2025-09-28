// Configuración específica para Vercel
const { PrismaClient } = require('@prisma/client');

// Inicializar Prisma con configuración de producción
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    datasources: {
      db: {
        // Para Vercel, usar PostgreSQL o MySQL en lugar de SQLite
        // url: process.env.DATABASE_URL
        url: "file:./dev.db"  // Temporal para demo
      }
    },
    log: ['error'],
  });
} else {
  // Desarrollo
  if (!global.__prisma) {
    global.__prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  prisma = global.__prisma;
}

module.exports = prisma;