import { PrismaClient, Role } from '@prisma/client'

// @ts-ignore
const prisma = new PrismaClient({})

async function main() {
    console.log('Start seeding...')

    // 1. Create Admin User
    const adminEmail = 'admin@medikalciniz.com'
    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            name: 'Admin',
            surname: 'User',
            password: 'securepassword123', // Plain text for now as requested
            role: Role.ADMIN,
        },
    })
    console.log({ admin })

    // 2. Define Categories
    const categoriesData = [
        { name: 'Koruyucu Ekipman', slug: 'koruyucu-ekipman', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80' },
        { name: 'Sarf Malzeme', slug: 'sarf-malzeme', image: 'https://images.unsplash.com/photo-1583912267670-6575ad43258d?w=500&q=80' },
        { name: 'Medikal Cihazlar', slug: 'medikal-cihazlar', image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&q=80' },
        { name: 'Laboratuvar', slug: 'laboratuvar', image: 'https://images.unsplash.com/photo-1585435557343-3b092031a877?w=500&q=80' },
        { name: 'İlk Yardım', slug: 'ilk-yardim', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80' },
    ]

    // 3. Define Products (20 items distributed)
    const productDefinitions = [
        // Koruyucu Ekipman
        { name: 'Cerrahi Maske 3 Katlı', catSlug: 'koruyucu-ekipman' },
        { name: 'N95 Solunum Maskesi', catSlug: 'koruyucu-ekipman' },
        { name: 'Lateks Eldiven M', catSlug: 'koruyucu-ekipman' },
        { name: 'Nitril Eldiven L', catSlug: 'koruyucu-ekipman' },
        { name: 'Koruyucu Yüz Siperliği', catSlug: 'koruyucu-ekipman' },
        { name: 'Tek Kullanımlık Önlük', catSlug: 'koruyucu-ekipman' },

        // Sarf Malzeme
        { name: 'Steril Gaz Kompres', catSlug: 'sarf-malzeme' },
        { name: 'El Dezenfektanı 1L', catSlug: 'sarf-malzeme' },
        { name: 'Tıbbi Atık Kutusu', catSlug: 'sarf-malzeme' },
        { name: 'Enjektör 5cc', catSlug: 'sarf-malzeme' },

        // Medikal Cihazlar
        { name: 'Dijital Ateş Ölçer', catSlug: 'medikal-cihazlar' },
        { name: 'Tansiyon Aleti', catSlug: 'medikal-cihazlar' },
        { name: 'Pulse Oksimetre', catSlug: 'medikal-cihazlar' },
        { name: 'Nebulizatör Cihazı', catSlug: 'medikal-cihazlar' },

        // Laboratuvar
        { name: 'Mikroskop Lamı', catSlug: 'laboratuvar' },
        { name: 'Santrifüj Tüpü', catSlug: 'laboratuvar' },
        { name: 'Petri Kabı', catSlug: 'laboratuvar' },

        // İlk Yardım
        { name: 'İlk Yardım Çantası (Araç)', catSlug: 'ilk-yardim' },
        { name: 'Boyunluk (Servikal)', catSlug: 'ilk-yardim' },
        { name: 'Elastik Bandaj', catSlug: 'ilk-yardim' },
    ]

    const images = [
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80',
        'https://images.unsplash.com/photo-1583912267670-6575ad43258d?w=500&q=80',
        'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&q=80',
        'https://images.unsplash.com/photo-1585435557343-3b092031a877?w=500&q=80',
    ]

    // Helper to get random item from array
    const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)]

    // Helper to get random number in range
    const getRandomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

    // Helper to get random price
    const getRandomPrice = (min: number, max: number) => {
        return Number((Math.random() * (max - min) + min).toFixed(2))
    }

    // Create Categories and Products
    for (const catData of categoriesData) {
        const category = await prisma.category.upsert({
            where: { slug: catData.slug },
            update: {},
            create: catData,
        })
        console.log(`Created category: ${category.name}`)

        const productsForCat = productDefinitions.filter(p => p.catSlug === catData.slug)

        for (const prodDef of productsForCat) {
            await prisma.product.create({
                data: {
                    name: prodDef.name,
                    description: `Profesyonel kullanım için uygun, yüksek kaliteli ${prodDef.name}.`,
                    price: getRandomPrice(50, 5000),
                    stock: getRandomNumber(0, 100),
                    sku: `SKU-${prodDef.catSlug.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(7).toUpperCase()}`,
                    categoryId: category.id,
                    images: [getRandom(images)], // Assign one random image
                    isFeatured: Math.random() > 0.8, // 20% chance to be featured
                    isActive: true,
                },
            })
        }
    }

    console.log('Seeding finished.')
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
