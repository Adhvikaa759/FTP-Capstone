import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// List with filters
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { search, cohort, track, role, graduationYear, company } = req.query;

    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { experiences: { some: { company: { contains: search, mode: 'insensitive' } } } },
      ];
    }
    if (cohort) where.cohort = cohort;
    if (graduationYear) where.graduationYear = parseInt(graduationYear);
    if (track) where.tracks = { some: { name: track } };
    if (role) where.roles = { some: { name: role } };
    if (company) where.experiences = { some: { company: { contains: company, mode: 'insensitive' } } };

    const members = await prisma.member.findMany({
      where,
      include: { tracks: true, roles: true, experiences: true },
      orderBy: { name: 'asc' },
    });

    res.json(members);
  } catch (err) {
    next(err);
  }
});

// Get single member
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const member = await prisma.member.findUnique({
      where: { id: req.params.id },
      include: { tracks: true, roles: true, experiences: true, createdBy: true, updatedBy: true },
    });
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (err) {
    next(err);
  }
});

// Create
router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const { name, email, cohort, graduationYear, linkedinUrl, bio, trackIds, roleIds, experiences } = req.body;

    const member = await prisma.member.create({
      data: {
        name,
        email,
        cohort,
        graduationYear: parseInt(graduationYear),
        linkedinUrl,
        bio,
        createdById: req.user.id,
        tracks: { connect: (trackIds || []).map(id => ({ id })) },
        roles: { connect: (roleIds || []).map(id => ({ id })) },
        experiences: { create: (experiences || []).map(e => ({ company: e.company, title: e.title, type: e.type })) },
      },
      include: { tracks: true, roles: true, experiences: true },
    });

    res.status(201).json(member);
  } catch (err) {
    next(err);
  }
});

// Update
router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { name, email, cohort, graduationYear, linkedinUrl, bio, isActive, trackIds, roleIds, experiences } = req.body;

    // Delete existing experiences and replace
    await prisma.experience.deleteMany({ where: { memberId: req.params.id } });

    const member = await prisma.member.update({
      where: { id: req.params.id },
      data: {
        name,
        email,
        cohort,
        graduationYear: parseInt(graduationYear),
        linkedinUrl,
        bio,
        isActive,
        updatedById: req.user.id,
        tracks: { set: (trackIds || []).map(id => ({ id })) },
        roles: { set: (roleIds || []).map(id => ({ id })) },
        experiences: { create: (experiences || []).map(e => ({ company: e.company, title: e.title, type: e.type })) },
      },
      include: { tracks: true, roles: true, experiences: true },
    });

    res.json(member);
  } catch (err) {
    next(err);
  }
});

// Delete
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    await prisma.member.delete({ where: { id: req.params.id } });
    res.json({ message: 'Member deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
