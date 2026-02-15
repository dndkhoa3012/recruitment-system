// Simple seed script for production (no tsx required)
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Running production seed...');

    const user = await prisma.user.findUnique({ where: { username: 'admin' } });
    if (!user) {
        await prisma.user.create({
            data: { username: 'admin', password: 'admin123', role: 'admin' }
        });
        console.log('Created admin user: admin');
    } else {
        console.log('Admin user already exists');
    }

    console.log('Seed complete.');
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error('Seed error:', e);
        prisma.$disconnect();
    });
