import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAdmin } from '../middleware/auth.js';
import { generateCSV } from '../utils/csvExport.js';

const router = Router();
const prisma = new PrismaClient();

router.get('/members/csv', requireAdmin, async (_req, res, next) => {
  try {
    const members = await prisma.member.findMany({
      include: { tracks: true, roles: true, experiences: true },
      orderBy: { name: 'asc' },
    });

    const csv = generateCSV(members);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=ftp-members.csv');
    res.send(csv);
  } catch (err) {
    next(err);
  }
});

export default router;
