import 'dotenv/config';
import app from './app';
import { prisma } from './lib/prisma';

const PORT = parseInt(process.env.PORT ?? '3000', 10);

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV ?? 'development'}`);
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
async function shutdown(signal: string) {
  console.log(`\n${signal} received — shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    console.log('✅ Server closed and DB disconnected');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  shutdown('UNHANDLED_REJECTION');
});
