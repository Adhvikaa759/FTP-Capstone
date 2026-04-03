import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { configurePassport } from './config/passport.js';
import authRoutes from './routes/auth.js';
import memberRoutes from './routes/members.js';
import trackRoutes from './routes/tracks.js';
import roleRoutes from './routes/roles.js';
import exportRoutes from './routes/export.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.NODE_ENV === 'production',
  },
}));

app.use(passport.initialize());
app.use(passport.session());
configurePassport();

app.use('/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/tracks', trackRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/export', exportRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
