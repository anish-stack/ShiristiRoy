import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

const dev = printf(({ level, message, timestamp: ts, stack }) => `${ts} ${level}: ${stack || message}`);

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports: [
    new winston.transports.Console({ format: combine(colorize(), timestamp(), dev) }),
    new DailyRotateFile({ filename: 'logs/app-%DATE%.log', datePattern: 'YYYY-MM-DD', maxSize: '20m', maxFiles: '14d' }),
    new DailyRotateFile({ filename: 'logs/error-%DATE%.log', level: 'error', datePattern: 'YYYY-MM-DD', maxFiles: '30d' }),
  ],
});

export default logger;
