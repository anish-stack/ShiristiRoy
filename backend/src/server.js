import 'dotenv/config';
import http from 'http';
import app from './app.js';
import { connectMongo } from './config/db.js';
import { connectRedis } from './config/redis.js';
import logger from './utils/logger.js';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  await connectMongo();
  await connectRedis();
  const server = http.createServer(app);
  server.listen(PORT, () => logger.info(`API up on :${PORT} (${process.env.NODE_ENV})`));

  const shutdown = async (sig) => {
    logger.warn(`${sig} received, closing...`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10000).unref();
  };
  ['SIGINT', 'SIGTERM'].forEach((s) => process.on(s, () => shutdown(s)));
  process.on('unhandledRejection', (err) => { logger.error('unhandledRejection', err); });
  process.on('uncaughtException', (err) => { logger.error('uncaughtException', err); process.exit(1); });
}

bootstrap();
