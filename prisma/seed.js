require('dotenv').config()
const { Client } = require('pg')
const { randomUUID } = require('crypto')

const client = new Client({
    connectionString: process.env.DATABASE_URL,
})

async function main() {
    try {
        await client.connect()
        console.log('Connected to database')

        // 1. Create Admin User
        const adminId = randomUUID()
        const adminEmail = 'admin@medikalciniz.com'

        // Check if admin exists
        const adminCheck = await client.query('SELECT id FROM users WHERE email = $1', [adminEmail])

        if (adminCheck.rows.length === 0) {
            await client.query(`
        INSERT INTO users (id, email, password, name, surname, role, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, 'ADMIN', NOW(), NOW())
      `, [adminId, adminEmail, 'securepassword123', 'Admin', 'User'])
            console.log('Created admin user')
        } else {
            console.log('Admin user already exists')
        }

        // 2. Categories
        const categoriesData = [
            { name: 'Koruyucu Ekipman', slug: 'koruyucu-ekipman', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80' },
            { name: 'Sarf Malzeme', slug: 'sarf-malzeme', image: 'https://images.unsplash.com/photo-1583912267670-6575ad43258d?w=500&q=80' },
            { name: 'Medikal Cihazlar', slug: 'medikal-cihazlar', image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&q=80' },
            { name: 'Laboratuvar', slug: 'laboratuvar', image: 'https://images.unsplash.com/photo-1585435557343-3b092031a877?w=500&q=80' },
            { name: 'İlk Yardım', slug: 'ilk-yardim', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80' },
        ]

        for (const cat of categoriesData) {
            // Upsert Category
            let catId
            const catCheck = await client.query('SELECT id FROM categories WHERE slug = $1', [cat.slug])

            if (catCheck.rows.length > 0) {
                catId = catCheck.rows[0].id
                console.log(`Category ${cat.name} exists`)
            } else {
                const res = await client.query(`
          INSERT INTO categories (name, slug, image)
          VALUES ($1, $2, $3)
          RETURNING id
        `, [cat.name, cat.slug, cat.image])
                catId = res.rows[0].id
                console.log(`Created category: ${cat.name}`)
            }

            // 3. Products for this category
            // Generate 4 products per category to match the 20 total
            for (let i = 1; i <= 4; i++) {
                const prodName = `${cat.name} Ürün ${i}`
                const prodSku = `SKU-${cat.slug.substring(0, 3).toUpperCase()}-${randomUUID().substring(0, 6).toUpperCase()}`

                await client.query(`
          INSERT INTO products (id, name, description, price, stock, sku, "categoryId", images, "isFeatured", "isActive", "createdAt", "updatedAt")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
          ON CONFLICT (sku) DO NOTHING
        `, [
                    randomUUID(),
                    prodName,
                    `Profesyonel kullanım için uygun, yüksek kaliteli ${prodName}.`,
                    (Math.random() * 4950 + 50).toFixed(2), // 50-5000
                    Math.floor(Math.random() * 101), // 0-100
                    prodSku,
                    catId,
                    [cat.image], // Use category image as placeholder
                    Math.random() > 0.8,
                    true
                ])
            }
        }

        console.log('Seeding finished.')
    } catch (e) {
        console.error('Seeding failed:', e)
        process.exit(1)
    } finally {
        await client.end()
    }
}

main()
