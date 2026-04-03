import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create tracks
  const tracks = await Promise.all([
    prisma.track.upsert({ where: { name: 'Consulting' }, update: {}, create: { name: 'Consulting', color: '#8B5CF6' } }),
    prisma.track.upsert({ where: { name: 'Tech Sales' }, update: {}, create: { name: 'Tech Sales', color: '#F59E0B' } }),
    prisma.track.upsert({ where: { name: 'Software Engineering' }, update: {}, create: { name: 'Software Engineering', color: '#3B82F6' } }),
    prisma.track.upsert({ where: { name: 'Product Management' }, update: {}, create: { name: 'Product Management', color: '#10B981' } }),
  ]);

  // Create roles
  const roles = await Promise.all([
    prisma.role.upsert({ where: { name: 'Analyst' }, update: {}, create: { name: 'Analyst' } }),
    prisma.role.upsert({ where: { name: 'Senior Analyst' }, update: {}, create: { name: 'Senior Analyst' } }),
    prisma.role.upsert({ where: { name: 'President' }, update: {}, create: { name: 'President' } }),
    prisma.role.upsert({ where: { name: 'Vice President' }, update: {}, create: { name: 'Vice President' } }),
    prisma.role.upsert({ where: { name: 'Alumni' }, update: {}, create: { name: 'Alumni' } }),
    prisma.role.upsert({ where: { name: 'Mentor' }, update: {}, create: { name: 'Mentor' } }),
  ]);

  const [consulting, techSales, swe, pm] = tracks;
  const [analyst, seniorAnalyst, president, vp, alumni, mentor] = roles;

  const members = [
    { name: 'Alex Rivera', email: 'arivera@ufl.edu', cohort: 'Spring 2025', graduationYear: 2025, linkedinUrl: 'https://linkedin.com/in/arivera', bio: 'Passionate about management consulting and strategy.', tracks: [consulting], roles: [seniorAnalyst], experiences: [{ company: 'Deloitte', title: 'Consulting Intern', type: 'INTERNSHIP' }] },
    { name: 'Jordan Chen', email: 'jchen@ufl.edu', cohort: 'Spring 2025', graduationYear: 2025, linkedinUrl: 'https://linkedin.com/in/jchen', bio: 'Full-stack developer focused on cloud-native apps.', tracks: [swe], roles: [analyst, alumni], experiences: [{ company: 'Google', title: 'Software Engineering Intern', type: 'INTERNSHIP' }, { company: 'Google', title: 'Software Engineer', type: 'FULLTIME' }] },
    { name: 'Priya Patel', email: 'ppatel@ufl.edu', cohort: 'Spring 2025', graduationYear: 2025, linkedinUrl: 'https://linkedin.com/in/ppatel', bio: 'Product thinker with a design background.', tracks: [pm], roles: [seniorAnalyst], experiences: [{ company: 'Meta', title: 'Product Management Intern', type: 'INTERNSHIP' }] },
    { name: 'Marcus Johnson', email: 'mjohnson@ufl.edu', cohort: 'Spring 2025', graduationYear: 2026, linkedinUrl: 'https://linkedin.com/in/mjohnson', bio: 'Former athlete turned tech sales leader.', tracks: [techSales], roles: [president], experiences: [{ company: 'Salesforce', title: 'Sales Development Rep', type: 'INTERNSHIP' }] },
    { name: 'Sofia Martinez', email: 'smartinez@ufl.edu', cohort: 'Fall 2025', graduationYear: 2026, bio: 'Data-driven consultant with a finance minor.', tracks: [consulting], roles: [analyst], experiences: [{ company: 'McKinsey', title: 'Business Analyst Intern', type: 'INTERNSHIP' }] },
    { name: 'Ethan Kim', email: 'ekim@ufl.edu', cohort: 'Fall 2025', graduationYear: 2026, linkedinUrl: 'https://linkedin.com/in/ekim', bio: 'Backend engineer who loves distributed systems.', tracks: [swe], roles: [analyst], experiences: [{ company: 'Amazon', title: 'Software Engineering Intern', type: 'INTERNSHIP' }] },
    { name: 'Olivia Brown', email: 'obrown@ufl.edu', cohort: 'Fall 2025', graduationYear: 2026, bio: 'Aspiring PM with experience in agile methodologies.', tracks: [pm, consulting], roles: [seniorAnalyst], experiences: [{ company: 'Microsoft', title: 'Product Management Intern', type: 'INTERNSHIP' }] },
    { name: 'Liam Thompson', email: 'lthompson@ufl.edu', cohort: 'Fall 2025', graduationYear: 2027, linkedinUrl: 'https://linkedin.com/in/lthompson', bio: 'Enterprise sales enthusiast.', tracks: [techSales], roles: [analyst], experiences: [{ company: 'Oracle', title: 'Sales Intern', type: 'INTERNSHIP' }] },
    { name: 'Ava Williams', email: 'awilliams@ufl.edu', cohort: 'Spring 2026', graduationYear: 2027, bio: 'Strategy consultant focused on healthcare.', tracks: [consulting], roles: [analyst], experiences: [{ company: 'Bain', title: 'Associate Consultant Intern', type: 'INTERNSHIP' }] },
    { name: 'Noah Davis', email: 'ndavis@ufl.edu', cohort: 'Spring 2026', graduationYear: 2027, linkedinUrl: 'https://linkedin.com/in/ndavis', bio: 'iOS and Android mobile developer.', tracks: [swe], roles: [analyst], experiences: [{ company: 'Apple', title: 'Software Engineering Intern', type: 'INTERNSHIP' }] },
    { name: 'Isabella Garcia', email: 'igarcia@ufl.edu', cohort: 'Spring 2026', graduationYear: 2027, bio: 'Product manager bridging tech and business.', tracks: [pm], roles: [analyst], experiences: [{ company: 'Capital One', title: 'Product Management Intern', type: 'INTERNSHIP' }] },
    { name: 'James Wilson', email: 'jwilson@ufl.edu', cohort: 'Spring 2025', graduationYear: 2025, bio: 'Former FTP VP, now mentoring new cohorts.', tracks: [consulting, techSales], roles: [vp, alumni, mentor], experiences: [{ company: 'BCG', title: 'Consulting Intern', type: 'INTERNSHIP' }, { company: 'Accenture', title: 'Management Consultant', type: 'FULLTIME' }] },
    { name: 'Emma Anderson', email: 'eanderson@ufl.edu', cohort: 'Fall 2025', graduationYear: 2026, linkedinUrl: 'https://linkedin.com/in/eanderson', bio: 'SaaS sales and customer success.', tracks: [techSales], roles: [seniorAnalyst], experiences: [{ company: 'SAP', title: 'Sales Development Rep', type: 'INTERNSHIP' }] },
    { name: 'Daniel Lee', email: 'dlee@ufl.edu', cohort: 'Spring 2025', graduationYear: 2025, bio: 'Machine learning engineer with a math background.', tracks: [swe], roles: [seniorAnalyst, alumni], experiences: [{ company: 'IBM', title: 'Software Engineering Intern', type: 'INTERNSHIP' }, { company: 'JPMorgan', title: 'Software Engineer', type: 'FULLTIME' }] },
    { name: 'Mia Taylor', email: 'mtaylor@ufl.edu', cohort: 'Spring 2026', graduationYear: 2027, bio: 'Fintech product management aspirant.', tracks: [pm, swe], roles: [analyst], experiences: [{ company: 'Goldman Sachs', title: 'Technology Analyst Intern', type: 'INTERNSHIP' }] },
    { name: 'Benjamin Moore', email: 'bmoore@ufl.edu', cohort: 'Fall 2025', graduationYear: 2026, bio: 'Consulting with a focus on digital transformation.', tracks: [consulting], roles: [analyst], experiences: [{ company: 'Morgan Stanley', title: 'Strategy Analyst Intern', type: 'INTERNSHIP' }] },
    { name: 'Charlotte Harris', email: 'charris@ufl.edu', cohort: 'Spring 2026', graduationYear: 2027, linkedinUrl: 'https://linkedin.com/in/charris', bio: 'Tech sales with a focus on cybersecurity solutions.', tracks: [techSales], roles: [analyst], experiences: [{ company: 'Salesforce', title: 'Account Executive Intern', type: 'INTERNSHIP' }] },
  ];

  for (const m of members) {
    await prisma.member.create({
      data: {
        name: m.name,
        email: m.email,
        cohort: m.cohort,
        graduationYear: m.graduationYear,
        linkedinUrl: m.linkedinUrl,
        bio: m.bio,
        tracks: { connect: m.tracks.map(t => ({ id: t.id })) },
        roles: { connect: m.roles.map(r => ({ id: r.id })) },
        experiences: {
          create: m.experiences.map(e => ({
            company: e.company,
            title: e.title,
            type: e.type,
          })),
        },
      },
    });
  }

  console.log('Seed complete: 4 tracks, 6 roles, 17 members');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
