
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Attempting to create contact_messages table manually...')

        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "contact_messages" (
        "id" TEXT NOT NULL,
        "firstName" TEXT NOT NULL,
        "lastName" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "subject" TEXT,
        "message" TEXT NOT NULL,
        "isRead" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
      );
    `)

        console.log('Table creation command executed successfully.')
    } catch (e) {
        console.error('Error creating table:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
