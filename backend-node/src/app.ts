import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import articleRoutes from './routes/articleRoutes';
import categoryRoutes from './routes/categoryRoutes';
import networkRoutes from './routes/networkRoutes';
import emailNotificationRoutes from './routes/emailNotificationRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

// ─── Security & Logging ───────────────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/networks', networkRoutes);
app.use('/api/notifications', emailNotificationRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
