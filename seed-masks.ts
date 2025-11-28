import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const category = await prisma.category.findUnique({
        where: { slug: 'sarf-malzeme' }
    })

    if (!category) {
        console.error('Category not found!')
        return
    }

    const masks = [
        {
            name: 'Cerrahi Maske (3 Katlı)',
            description: 'Yüksek korumalı, 3 katlı cerrahi maske. 50\'li paket.',
            price: 49.90,
            stock: 1000,
            sku: 'MSK-001',
            images: ['https://images.unsplash.com/photo-1586942593568-29361efcd571?q=80&w=500'],
            categoryId: category.id,
            isActive: true,
            isFeatured: true
        },
        {
            name: 'N95 Solunum Maskesi',
            description: 'FFP2/N95 standartlarında yüksek filtrasyonlu maske.',
            price: 14.90,
            stock: 500,
            sku: 'MSK-002',
            images: ['https://images.unsplash.com/photo-1585776245991-cf89dd7fcaf3?q=80&w=500'],
            categoryId: category.id,
            isActive: true,
            isFeatured: false
        },
        {
            name: 'Çocuk Maskesi Desenli',
            description: 'Çocuklar için özel boyutlu ve desenli koruyucu maske.',
            price: 59.90,
            stock: 200,
            sku: 'MSK-003',
            images: ['https://images.unsplash.com/photo-1611079830811-865ecaa52d5e?q=80&w=500'],
            categoryId: category.id,
            isActive: true,
            isFeatured: false
        }
    ]

    for (const mask of masks) {
        await prisma.product.upsert({
            where: { sku: mask.sku },
            update: {},
            create: mask
        })
        console.log(`Created/Updated: ${mask.name}`)
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
