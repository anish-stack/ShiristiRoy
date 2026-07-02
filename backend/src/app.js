import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import swaggerUi from 'swagger-ui-express';
import { rateLimiter } from './middlewares/rateLimit.js';
import { errorHandler, notFound } from './middlewares/error.js';
import routes from './routes/index.js';
import { swaggerSpec } from './docs/swagger.js';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const apiBase = `/api/${process.env.API_VERSION || 'v1'}`;

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../public/uploads"))
);
app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: (origin, cb) => {
    return cb(null, true);
    const allowed = (process.env.CORS_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
    if (!origin || allowed.includes(origin)) return cb(null, true);
    return cb(new Error('CORS blocked'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(rateLimiter);

app.get('/health', (req, res) => res.json({ status: 'ok', ts: Date.now() }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(apiBase, routes);

app.use(notFound);
app.use(errorHandler);

export default app;
