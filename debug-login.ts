
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'test@example.com' // Replace with the email the user tried
    const password = 'password123' // Replace with the password the user tried

    // Since I don't know the exact credentials the user used, I will create a test user
    // and try to verify it to ensure the hashing/comparison logic is correct.

    const testEmail = 'debug_user@test.com'
    const testPass = 'debugPass123'

    console.log(`Creating/Updating debug user: ${testEmail}`)
    const hashedPassword = await bcrypt.hash(testPass, 10)

    const user = await prisma.user.upsert({
        where: { email: testEmail },
        update: { password: hashedPassword },
        create: {
            email: testEmail,
            name: 'Debug',
            surname: 'User',
            password: hashedPassword,
            role: 'CUSTOMER'
        }
    })

    console.log('User created/updated. Verifying password...')

    const fetchedUser = await prisma.user.findUnique({ where: { email: testEmail } })
    if (!fetchedUser) {
        console.error('User not found after creation!')
        return
    }

    const isMatch = await bcrypt.compare(testPass, fetchedUser.password)
    console.log(`Password match result: ${isMatch}`)

    if (isMatch) {
        console.log('SUCCESS: Login logic should work.')
    } else {
        console.error('FAILURE: Password mismatch.')
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
