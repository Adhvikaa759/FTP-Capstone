import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

router.get('/', requireAuth, async (_req, res, next) => {
  try {
    const roles = await prisma.role.findMany({ orderBy: { name: 'asc' } });
    res.json(roles);
  } catch (err) {
    next(err);
  }
});

export default router;
