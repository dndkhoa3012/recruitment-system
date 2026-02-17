import { prisma } from './src/lib/prisma';

async function main() {
    const userCount = await prisma.user.count();
    const jobCount = await prisma.job.count();
    const categoryCount = await prisma.category.count();

    console.log('--- DB Status ---');
    console.log(`Users: ${userCount}`);
    console.log(`Jobs: ${jobCount}`);
    console.log(`Categories: ${categoryCount}`);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
