const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Checking ContactMessage table...');
        const count = await prisma.contactMessage.count();
        console.log(`ContactMessage table exists. Current count: ${count}`);

        console.log('Creating a test message...');
        const message = await prisma.contactMessage.create({
            data: {
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                subject: 'Test Subject',
                message: 'This is a test message.',
            },
        });
        console.log('Test message created:', message.id);

        console.log('Deleting test message...');
        await prisma.contactMessage.delete({
            where: { id: message.id },
        });
        console.log('Test message deleted.');

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
