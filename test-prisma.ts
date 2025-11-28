import { PrismaClient } from '@prisma/client'

async function main() {
    console.log('Imported PrismaClient:', PrismaClient)
    try {
        const prisma = new PrismaClient()
        console.log('Successfully instantiated PrismaClient')
        await prisma.$connect()
        console.log('Successfully connected to database')
        await prisma.$disconnect()
    } catch (e) {
        console.error('Error:', e)
    }
}

main()
