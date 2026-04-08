import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const members = await prisma.member.findMany({
        orderBy: { createdAt: 'desc' }
    });

    const seen = new Set();
    const toDelete = [];

    for (const member of members) {
        if (!member.email) continue;
        if (seen.has(member.email)) {
            toDelete.push(member.id);
        } else {
            seen.add(member.email);
        }
    }

    if (toDelete.length > 0) {
        console.log(`Deleting ${toDelete.length} duplicate members...`);
        await prisma.experience.deleteMany({ where: { memberId: { in: toDelete } } });
        await prisma.member.deleteMany({ where: { id: { in: toDelete } } });
        console.log('Done deduplicating.');
    } else {
        console.log('No duplicates found.');
    }
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
