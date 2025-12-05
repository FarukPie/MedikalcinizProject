
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Verifying Roles and Permissions...')

    const roles = await prisma.role.findMany({
        where: {
            name: { in: ['Yönetici', 'Müşteri'] }
        }
    })

    console.log('Roles found:', roles.length)
    roles.forEach(role => {
        console.log(`Role: ${role.name}`)
        console.log('Permissions:', JSON.stringify(role.permissions, null, 2))
    })

    const adminUser = await prisma.user.findUnique({
        where: { email: 'admin@medikalciniz.com' },
        include: { assignedRole: true }
    })

    if (adminUser) {
        console.log('Admin User found:', adminUser.email)
        console.log('Assigned Role:', adminUser.assignedRole?.name)
    } else {
        console.log('Admin User NOT found')
    }
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
