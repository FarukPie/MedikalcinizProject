
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
    try {
        const partnersCount = await prisma.partner.count();
        const productsCount = await prisma.product.count();
        console.log('Partners count:', partnersCount);
        console.log('Products count:', productsCount);
    } catch (error) {
        console.error('Error checking data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkData();
