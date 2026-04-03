import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

router.get('/', requireAuth, async (_req, res, next) => {
  try {
    const tracks = await prisma.track.findMany({ orderBy: { name: 'asc' } });
    res.json(tracks);
  } catch (err) {
    next(err);
  }
});

export default router;
