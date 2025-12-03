import { PrismaClient, PartnerType, DocStatus, TransactionType } from '@prisma/client'

const prisma = new PrismaClient()

// Helpers
function getRandomDate(monthsBack: number = 3) {
    const date = new Date();
    date.setMonth(date.getMonth() - Math.floor(Math.random() * monthsBack));
    date.setDate(Math.floor(Math.random() * 28) + 1);
    return date;
}

function getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min: number, max: number) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

async function main() {
    console.log('Start seeding ...')

    // 1. Clean Slate
    console.log('Cleaning existing data...')
    try {
        await prisma.transaction.deleteMany()
        await prisma.invoiceItem.deleteMany()
        await prisma.invoice.deleteMany()
        await prisma.waybill.deleteMany()
        await prisma.orderItem.deleteMany()
        await prisma.order.deleteMany()
        await prisma.proposalItem.deleteMany()
        await prisma.proposal.deleteMany()
        await prisma.cartItem.deleteMany()
        await prisma.cart.deleteMany()
        await prisma.favorite.deleteMany()
        await prisma.product.deleteMany()
        await prisma.warehouse.deleteMany()
        await prisma.partner.deleteMany()
    } catch (error) {
        console.warn("Error cleaning data, maybe tables don't exist yet or foreign key constraints. Continuing...", error)
    }

    // 2. Create Warehouses
    console.log('Creating Warehouses...')
    const warehouses = []
    const warehouseNames = ["Merkez Depo", "Şube Depo", "İade Deposu"]
    for (const name of warehouseNames) {
        const w = await prisma.warehouse.create({
            data: { name, shelfCount: 50, rowCount: 10 }
        })
        warehouses.push(w)
    }
    console.log(`Created ${warehouses.length} warehouses`)

    // 3. Create Partners
    console.log('Creating Partners...')
    const partners = []
    const customerNames = [
        "Özel Ege Hastanesi", "Dr. Mehmet Öz", "Acıbadem Grubu", "Şehir Hastanesi",
        "Medikal Park", "Dr. Ayşe Yılmaz", "Anadolu Sağlık", "Florence Nightingale",
        "Memorial Şişli", "Liv Hospital"
    ]
    const supplierNames = [
        "3M Medikal", "Global Eldiven A.Ş.", "Bayer Türk", "Pfizer İlaç",
        "Roche Diagnostik", "Siemens Healthineers", "Philips Medikal", "GE Healthcare",
        "Abbott Laboratuvarları", "Johnson & Johnson"
    ]

    for (const name of customerNames) {
        const p = await prisma.partner.create({
            data: {
                name,
                type: PartnerType.CUSTOMER,
                email: `info@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
                phone: `05${getRandomInt(30, 59)} ${getRandomInt(100, 999)} ${getRandomInt(10, 99)} ${getRandomInt(10, 99)}`,
                address: "İstanbul, Türkiye",
                taxNumber: `${getRandomInt(1000000000, 9999999999)}`
            }
        })
        partners.push(p)
    }

    for (const name of supplierNames) {
        const p = await prisma.partner.create({
            data: {
                name,
                type: PartnerType.SUPPLIER,
                email: `contact@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
                phone: `0212 ${getRandomInt(100, 999)} ${getRandomInt(10, 99)} ${getRandomInt(10, 99)}`,
                address: "Ankara, Türkiye",
                taxNumber: `${getRandomInt(1000000000, 9999999999)}`
            }
        })
        partners.push(p)
    }
    console.log(`Created ${partners.length} partners`)

    // 4. Create/Update Products
    console.log('Creating Products...')
    let category = await prisma.category.findFirst()
    if (!category) {
        category = await prisma.category.create({
            data: { name: "Genel", slug: "genel" }
        })
    }

    const productNames = [
        "Latex Muayene Eldiveni", "Cerrahi Maske 3 Katlı", "N95 Maske",
        "Enjektör 5ml", "Enjektör 10ml", "Bistüri Ucu No:15",
        "Sargı Bezi 10cm", "Batikon 1L", "Serum Fizyolojik 500ml",
        "Flaster Bez", "Bone", "Galoş", "Önlük", "Siperlik"
    ]

    const products: any[] = []
    for (let i = 0; i < productNames.length; i++) {
        const name = productNames[i]
        const p = await prisma.product.create({
            data: {
                name,
                code: `PRD-${1000 + i}`,
                categoryId: category.id,
                warehouseId: getRandomItem(warehouses).id,
                stock: getRandomInt(100, 1000),
                buyPrice: getRandomFloat(10, 100),
                sellPrice: getRandomFloat(120, 200),
                unit: getRandomItem(["Adet", "Kutu", "Paket"]),
                description: `${name} - Yüksek Kalite`
            }
        })
        products.push(p)
    }
    console.log(`Created ${products.length} products`)

    // 5. Documents

    // Proposals
    console.log('Creating Proposals...')
    for (let i = 0; i < 20; i++) {
        const partner = getRandomItem(partners)
        const itemsCount = getRandomInt(1, 5)
        let total = 0

        const itemsData = Array.from({ length: itemsCount }).map(() => {
            const prod = getRandomItem(products) as any
            const qty = getRandomInt(1, 10)
            const lineTotal = Number(prod.sellPrice) * qty
            total += lineTotal
            return {
                productId: prod.id,
                productName: prod.name,
                quantity: qty,
                price: prod.sellPrice,
                taxRate: 20,
                total: lineTotal
            }
        })

        await prisma.proposal.create({
            data: {
                number: `TEK-2024-${1000 + i}`,
                date: getRandomDate(),
                status: getRandomItem([DocStatus.DRAFT, DocStatus.SENT]),
                partnerId: partner.id,
                items: {
                    create: itemsData
                },
                totalAmount: total
            }
        })
    }

    // Orders
    console.log('Creating Orders...')
    const orders: any[] = []
    for (let i = 0; i < 20; i++) {
        const partner = getRandomItem(partners)
        const itemsCount = getRandomInt(1, 5)
        let total = 0

        const itemsData = Array.from({ length: itemsCount }).map(() => {
            const prod = getRandomItem(products) as any
            const qty = getRandomInt(5, 50)
            const lineTotal = Number(prod.sellPrice) * qty
            total += lineTotal
            return {
                productId: prod.id,
                productName: prod.name,
                quantity: qty,
                price: prod.sellPrice,
                total: lineTotal
            }
        })

        const order = await prisma.order.create({
            data: {
                number: `SIP-2024-${1000 + i}`,
                date: getRandomDate(),
                status: getRandomItem([DocStatus.PENDING, DocStatus.COMPLETED]),
                partnerId: partner.id,
                items: {
                    create: itemsData
                },
                totalAmount: total
            }
        })
        orders.push(order)
    }

    // Waybills
    console.log('Creating Waybills...')
    for (let i = 0; i < 20; i++) {
        const partner = getRandomItem(partners)
        await prisma.waybill.create({
            data: {
                number: `IRS-2024-${1000 + i}`,
                type: "Satış İrsaliyesi",
                date: getRandomDate(),
                status: DocStatus.SENT,
                partnerId: partner.id
            }
        })
    }

    // Invoices & Transactions
    console.log('Creating Invoices & Transactions...')
    for (let i = 0; i < 20; i++) {
        const partner = getRandomItem(partners)
        const isSales = Math.random() > 0.5
        const type = isSales ? "Satış Faturası" : "Alış Faturası"
        const itemsCount = getRandomInt(1, 5)
        let subTotal = 0

        const itemsData = Array.from({ length: itemsCount }).map(() => {
            const prod = getRandomItem(products) as any
            const qty = getRandomInt(10, 100)
            const price = isSales ? Number(prod.sellPrice) : Number(prod.buyPrice)
            const lineTotal = price * qty
            subTotal += lineTotal
            return {
                productId: prod.id,
                productName: prod.name,
                quantity: qty,
                price,
                taxRate: 20,
                total: lineTotal
            }
        })

        // Create Invoice
        const invoice = await prisma.invoice.create({
            data: {
                number: `FTR-2024-${1000 + i}`,
                type,
                date: getRandomDate(),
                status: DocStatus.PENDING,
                partnerId: partner.id,
                orderId: isSales && Math.random() > 0.7 ? getRandomItem(orders).id : undefined,
                items: {
                    create: itemsData
                },
                subTotal: subTotal,
                taxTotal: subTotal * 0.20,
                totalAmount: subTotal * 1.20
            }
        })

        // Create Transaction
        await prisma.transaction.create({
            data: {
                date: invoice.date,
                description: `${type} - ${invoice.number}`,
                type: isSales ? TransactionType.DEBT : TransactionType.CREDIT,
                amount: invoice.totalAmount,
                partnerId: partner.id,
                invoiceId: invoice.id
            }
        })

        // Update Partner Balance
        const amount = Number(invoice.totalAmount)
        const balanceChange = isSales ? amount : -amount

        await prisma.partner.update({
            where: { id: partner.id },
            data: {
                balance: { increment: balanceChange }
            }
        })
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

export { }
