
const { createProposal } = require('./lib/actions/proposal');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testCreate() {
    try {
        // Get a partner and product
        const partner = await prisma.partner.findFirst();
        const product = await prisma.product.findFirst();

        if (!partner || !product) {
            console.error('No partner or product found to test with.');
            return;
        }

        const data = {
            partnerId: partner.id,
            date: new Date().toISOString(),
            validUntil: new Date(Date.now() + 86400000).toISOString(),
            type: 'Satış Teklifi',
            notes: 'Test proposal from script',
            items: [
                {
                    productId: product.id,
                    productName: product.name,
                    quantity: 2,
                    price: Number(product.sellPrice),
                    taxRate: Number(product.taxRate),
                    total: Number(product.sellPrice) * 2
                }
            ]
        };

        console.log('Testing createProposal with data:', data);
        const result = await createProposal(data);
        console.log('Result:', result);

    } catch (error) {
        console.error('Error testing createProposal:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testCreate();
