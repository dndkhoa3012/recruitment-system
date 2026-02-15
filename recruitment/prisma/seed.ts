import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
    console.log(`Start seeding...`)

    // Seed Admin User
    const adminUser = await prisma.user.findUnique({ where: { username: 'admin' } });
    if (!adminUser) {
        await prisma.user.create({
            data: {
                username: 'admin',
                password: 'admin123', // TODO: Hash this in production!
                role: 'admin'
            }
        });
        console.log('Created admin user: admin');
    } else {
        console.log('Admin user already exists');
    }

    console.log(`Seeding finished.`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
