import Redis from 'ioredis';
import Redlock from 'redlock';
import logger from '../utils/logger.js';

export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT || 6379),
  password: process.env.REDIS_PASSWORD || undefined,
  db: Number(process.env.REDIS_DB || 0),
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
});

export const redlock = new Redlock([redis], {
  driftFactor: 0.01,
  retryCount: Number(process.env.SLOT_LOCK_RETRY_COUNT || 3),
  retryDelay: Number(process.env.SLOT_LOCK_RETRY_DELAY_MS || 200),
  retryJitter: 100,
  automaticExtensionThreshold: 500,
});

export async function connectRedis() {
  try {
    // if already connected
    if (redis.status === 'ready') {
      logger.info('Redis already ready');
      return;
    }

    await new Promise((resolve, reject) => {
      redis.once('ready', resolve);
      redis.once('error', reject);
    });

    logger.info('Redis ready');
  } catch (e) {
    logger.error('Redis err', e);
    throw e;
  }
}

redlock.on('clientError', (e) => logger.error('Redlock err', e));