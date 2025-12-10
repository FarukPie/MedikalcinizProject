
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.productHistory.count();
        console.log(`ProductHistory count: ${count}`);
        console.log('SUCCESS: Table exists.');
    } catch (e) {
        console.error('ERROR: Table likely missing or connection failed.');
        console.error(e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
