
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Checking ContactMessage table...')
        const count = await prisma.contactMessage.count()
        console.log(`Table exists. Current count: ${count}`)
    } catch (e) {
        console.error('Error accessing ContactMessage table:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
