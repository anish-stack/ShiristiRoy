import mongoose from 'mongoose';
import logger from '../utils/logger.js';

export async function connectMongo() {
  mongoose.set('strictQuery', true);
  const uri = process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;
  await mongoose.connect(uri, { maxPoolSize: 50, serverSelectionTimeoutMS: 8000 });
  logger.info('Mongo connected');
  mongoose.connection.on('error', (e) => logger.error('Mongo error', e));
  mongoose.connection.on('disconnected', () => logger.warn('Mongo disconnected'));
}
