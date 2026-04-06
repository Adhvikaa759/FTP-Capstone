import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// List all users
router.get('/', requireAdmin, async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({ orderBy: { name: 'asc' } });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// Update user role
router.put('/:id/role', requireAdmin, async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['ADMIN', 'VIEWER'].includes(role)) {
      return res.status(400).json({ error: 'Role must be ADMIN or VIEWER' });
    }

    // Prevent demoting yourself
    if (req.params.id === req.user.id && role !== 'ADMIN') {
      return res.status(400).json({ error: 'You cannot demote yourself' });
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

export default router;
