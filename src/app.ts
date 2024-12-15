import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { todoRoutes } from './routes/todos';
import { authRoutes } from './routes/auth';
import { requireAuth } from './middleware/auth';

dotenv.config();

const app = express();

if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:8081',
    'exp://localhost:19000'
  ],
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', requireAuth, todoRoutes);

export { app };
