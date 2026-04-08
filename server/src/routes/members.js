import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import multer from 'multer';
import { parse } from 'csv-parse/sync';

const router = Router();
const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });

// CSV Import
router.post('/import-csv', requireAdmin, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const csvData = req.file.buffer.toString('utf-8');

    // Auto-detect delimiter
    const firstLine = csvData.split('\n')[0];
    const delimiter = firstLine.includes('\t') ? '\t' : (firstLine.includes(';') ? ';' : ',');

    const records = parse(csvData, {
      // Aggressively clean headers: trim, lowercase, and remove non-alphanumeric
      columns: header => header.map(h => h.trim().toLowerCase().replace(/[^a-z0-9]/g, '')),
      skip_empty_lines: true,
      trim: true,
      bom: true,
      delimiter: delimiter,
      relax_column_count: true
    });

    const detectedKeys = records.length > 0 ? Object.keys(records[0]) : [];

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    for (const r of records) {
      // Find name using various possible cleaned keys
      const name = r.name || r.username || r.fullname || r.membername || r.user || r[Object.keys(r)[0]];
      const email = r.email || null;

      if (!name || (typeof name === 'string' && name.toLowerCase() === 'name')) { // skip header row if it leaked in
        skipped++;
        continue;
      }

      const cohort = r.cohort || 'Unknown';
      const graduationYear = r.graduationyear || r.gradyear || r.classof || null;
      const linkedinUrl = r.linkedinurl || r.linkedin || r.url || null;
      const bio = r.bio || r.description || null;

      // Extract mixed-separator arrays (comma or semicolon)
      const splitArr = (val) => String(val || '').split(/[;,]/).map(t => t.trim()).filter(Boolean);

      let tracks = splitArr(r.track || r.tracks);
      let roles = splitArr(r.role || r.roles);
      const companies = splitArr(r.company || r.companies);
      const positions = splitArr(r.position || r.title || r.titles);
      const rawTypes = splitArr(r.type || r.types);

      // Normalize Tracks: 'Software Engineering' -> 'SWE', 'Product Management' -> 'PM'
      tracks = tracks.map(t => {
        const lower = t.toLowerCase();
        if (lower.includes('software engineering')) return 'SWE';
        if (lower.includes('product management')) return 'PM';
        return t;
      });

      // Normalize Roles: Normalize "VP X" or "Vice President" to just "VP"
      roles = roles.map(ro => {
        const lower = ro.toLowerCase();
        if (lower.includes('vp') || lower.includes('vice president')) return 'VP';
        return ro;
      });

      // Link companies and positions (match 1-to-1, or fallback to the 1st position)
      const experiencesData = companies.map((company, idx) => {
        const rawType = (rawTypes[idx] || rawTypes[0] || '').toLowerCase();
        let finalType = 'INTERNSHIP';
        if (rawType.includes('full') || rawType === 'ft') finalType = 'FULLTIME';

        return {
          company,
          title: positions[idx] || positions[0] || 'Unknown Position',
          type: finalType
        };
      });

      // Ensure tracks and roles actually exist in the database before linking them
      await Promise.all(tracks.map(t => prisma.track.upsert({ where: { name: t }, update: {}, create: { name: t } })));
      await Promise.all(roles.map(ro => prisma.role.upsert({ where: { name: ro }, update: {}, create: { name: ro } })));

      const trackConnect = tracks.map(nm => ({ name: nm }));
      const roleConnect = roles.map(nm => ({ name: nm }));

      // Look up member by email or name to prevent duplicates
      let existing = null;
      if (email && String(email).trim()) {
        existing = await prisma.member.findUnique({ where: { email: String(email).trim() } });
      } else {
        existing = await prisma.member.findFirst({ where: { name: String(name).trim() } });
      }

      if (existing) {
        // Wipe old experiences to cleanly replace them
        await prisma.experience.deleteMany({ where: { memberId: existing.id } });

        await prisma.member.update({
          where: { id: existing.id },
          data: {
            email: email ? String(email).trim() : null,
            cohort,
            graduationYear: graduationYear ? parseInt(graduationYear) : null,
            linkedinUrl,
            bio,
            updatedById: req.user.id,
            tracks: { set: trackConnect },
            roles: { set: roleConnect },
            experiences: { create: experiencesData }
          }
        });
        updated++;
      } else {
        await prisma.member.create({
          data: {
            name: String(name).trim(),
            email: email ? String(email).trim() : null,
            cohort,
            graduationYear: graduationYear ? parseInt(graduationYear) : null,
            linkedinUrl,
            bio,
            createdById: req.user.id,
            tracks: { connect: trackConnect },
            roles: { connect: roleConnect },
            experiences: { create: experiencesData }
          }
        });
        imported++;
      }
    }

    res.json({ imported, updated, skipped, detectedKeys });
  } catch (err) {
    next(err);
  }
});

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
      distinct: ['id'],
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
        email: email || null,
        cohort,
        graduationYear: graduationYear ? parseInt(graduationYear) : null,
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
        email: email || null,
        cohort,
        graduationYear: graduationYear ? parseInt(graduationYear) : null,
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
