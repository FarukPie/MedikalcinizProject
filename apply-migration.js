
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Creating table...');
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "product_history" (
        "id" TEXT NOT NULL,
        "action" TEXT NOT NULL,
        "productId" TEXT NOT NULL,
        "description" TEXT,
        "oldValue" TEXT,
        "newValue" TEXT,
        "user" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
        CONSTRAINT "product_history_pkey" PRIMARY KEY ("id")
      );
    `);
        console.log('Table created.');

        console.log('Adding foreign key...');
        // We wrap this in try-catch in case it already exists or fails for other reasons
        try {
            await prisma.$executeRawUnsafe(`
            ALTER TABLE "product_history" ADD CONSTRAINT "product_history_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        `);
            console.log('Foreign key added.');
        } catch (fkError) {
            console.log('Foreign key creation failed (might already exist): ' + fkError.message);
        }

        console.log('Migration applied successfully.');
    } catch (e) {
        console.error('ERROR during migration:');
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
