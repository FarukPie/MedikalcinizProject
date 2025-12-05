import { PrismaClient, PartnerType, DocStatus, TransactionType } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

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

// Permission Types
type PermissionType = {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
}

type ModulePermissions = {
    [key: string]: PermissionType;
}

const ALL_MODULES = [
    'dashboard', 'users', 'roles', 'products', 'warehouse',
    'proposals', 'waybills', 'invoices', 'partners', 'orders',
    'finance', 'messages'
];

async function main() {
    console.log('Start seeding ...')

    // 1. Clean Slate
    console.log('Cleaning existing data...')
    try {
        await prisma.transaction.deleteMany()
        await prisma.invoiceItem.deleteMany()
        await prisma.invoice.deleteMany()
        await prisma.waybillItem.deleteMany()
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
        // Don't delete roles and users to preserve admin access if re-seeding partial data
        // But for a full reset, we might want to. 
        // The user asked to "upsert", implying preservation.
    } catch (error) {
        console.warn("Error cleaning data, maybe tables don't exist yet or foreign key constraints. Continuing...", error)
    }

    // 2. Create Roles & Admin User
    console.log('Creating Roles & Admin User...')

    // Define Permissions
    const fullAccess: PermissionType = { view: true, create: true, edit: true, delete: true };
    const noAccess: PermissionType = { view: false, create: false, edit: false, delete: false };

    // Admin Permissions (All True)
    const adminPermissions: ModulePermissions = {};
    ALL_MODULES.forEach(module => {
        adminPermissions[module] = fullAccess;
    });

    // Customer Permissions
    const customerPermissions: ModulePermissions = {};
    ALL_MODULES.forEach(module => {
        customerPermissions[module] = noAccess;
    });

    // Override for Customer
    customerPermissions['proposals'] = { view: true, create: false, edit: false, delete: false };
    customerPermissions['orders'] = { view: true, create: true, edit: false, delete: false };
    customerPermissions['finance'] = { view: true, create: false, edit: false, delete: false };
    customerPermissions['dashboard'] = { view: true, create: false, edit: false, delete: false };

    // Upsert Roles
    const adminRole = await prisma.role.upsert({
        where: { name: 'Yönetici' },
        update: { permissions: adminPermissions as any },
        create: {
            name: 'Yönetici',
            description: 'Tam yetkili sistem yöneticisi.',
            permissions: adminPermissions as any
        }
    });

    const customerRole = await prisma.role.upsert({
        where: { name: 'Müşteri' },
        update: { permissions: customerPermissions as any },
        create: {
            name: 'Müşteri',
            description: 'Sadece kendi finansal verilerini ve siparişlerini görebilir.',
            permissions: customerPermissions as any
        }
    });

    console.log('Roles upserted.');

    // Upsert Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await prisma.user.upsert({
        where: { email: 'admin@medikalciniz.com' },
        update: {
            assignedRoleId: adminRole.id
        },
        create: {
            email: 'admin@medikalciniz.com',
            name: 'Sistem',
            surname: 'Yöneticisi',
            password: hashedPassword,
            assignedRoleId: adminRole.id,
            role: 'ADMIN' // Keeping the enum role as well for backward compatibility if used
        }
    });

    console.log('Admin user upserted.');

    // 3. Create Warehouses
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

    // 4. Create Partners
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

    // 5. Create Categories & Products
    console.log('Creating Categories and Products...')

    const categoriesData = [
        { name: "Koruyucu Ekipman", slug: "koruyucu-ekipman" },
        { name: "Tek Kullanımlık Ürünler", slug: "tek-kullanimlik" },
        { name: "Medikal Cihazlar", slug: "medikal-cihazlar" },
        { name: "Laboratuvar", slug: "laboratuvar" },
        { name: "Sarf Malzeme", slug: "sarf-malzeme" }
    ]

    const productsData: Record<string, any[]> = {
        "koruyucu-ekipman": [
            { name: "Cerrahi Maske 3 Katlı (50'li)", price: 75.00, stock: 500 },
            { name: "N95 Solunum Maskesi", price: 25.00, stock: 200 },
            { name: "Koruyucu Tulum (L Beden)", price: 150.00, stock: 50 },
            { name: "Yüz Siperliği", price: 45.00, stock: 100 }
        ],
        "tek-kullanimlik": [
            { name: "Lateks Muayene Eldiveni (M - 100'lü)", price: 120.00, stock: 300 },
            { name: "Nitril Eldiven (L - 100'lü)", price: 140.00, stock: 250 },
            { name: "Galoş (1000'li Paket)", price: 200.00, stock: 100 },
            { name: "Bone (Lastikli - 100'lü)", price: 60.00, stock: 150 }
        ],
        "medikal-cihazlar": [
            { name: "Dijital Ateş Ölçer", price: 350.00, stock: 40 },
            { name: "Pulse Oksimetre", price: 250.00, stock: 60 },
            { name: "Dijital Tansiyon Aleti", price: 850.00, stock: 20 }
        ],
        "sarf-malzeme": [
            { name: "Enjektör 5ml (100'lü)", price: 90.00, stock: 400 },
            { name: "Serum Seti", price: 15.00, stock: 500 },
            { name: "Batikon 100ml", price: 35.00, stock: 100 }
        ],
        "laboratuvar": [] // No specific products requested, but category exists
    }

    const createdProducts: any[] = []
    let productCounter = 1000

    for (const catData of categoriesData) {
        const category = await prisma.category.upsert({
            where: { slug: catData.slug },
            update: { name: catData.name },
            create: { name: catData.name, slug: catData.slug }
        })

        const catProducts = productsData[catData.slug] || []

        for (const prod of catProducts) {
            const p = await prisma.product.create({
                data: {
                    name: prod.name,
                    code: `PRD-${productCounter++}`,
                    categoryId: category.id,
                    warehouseId: getRandomItem(warehouses).id,
                    stock: prod.stock,
                    buyPrice: Number(prod.price) * 0.6, // Assuming 40% margin
                    sellPrice: prod.price,
                    unit: "Adet", // Default unit
                    description: `${prod.name} - Yüksek Kalite Medikal Ürün`,
                    isActive: true
                }
            })
            createdProducts.push(p)
        }
    }
    console.log(`Created ${createdProducts.length} specific products`)

    // 6. Documents (Proposals, Orders, etc.) - Using the new products
    if (createdProducts.length > 0) {
        // Proposals
        console.log('Creating Proposals...')
        for (let i = 0; i < 10; i++) {
            const partner = getRandomItem(partners)
            const itemsCount = getRandomInt(1, 3)
            let total = 0

            const itemsData = Array.from({ length: itemsCount }).map(() => {
                const prod = getRandomItem(createdProducts)
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
                    number: `TEK-2024-${2000 + i}`,
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
        for (let i = 0; i < 10; i++) {
            const partner = getRandomItem(partners)
            const itemsCount = getRandomInt(1, 3)
            let total = 0

            const itemsData = Array.from({ length: itemsCount }).map(() => {
                const prod = getRandomItem(createdProducts)
                const qty = getRandomInt(5, 20)
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
                    number: `SIP-2024-${2000 + i}`,
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

        // Invoices
        console.log('Creating Invoices...')
        for (let i = 0; i < 10; i++) {
            const partner = getRandomItem(partners)
            const isSales = Math.random() > 0.5
            const type = isSales ? "Satış Faturası" : "Alış Faturası"
            const itemsCount = getRandomInt(1, 3)
            let subTotal = 0

            const itemsData = Array.from({ length: itemsCount }).map(() => {
                const prod = getRandomItem(createdProducts)
                const qty = getRandomInt(5, 50)
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

            const invoice = await prisma.invoice.create({
                data: {
                    number: `FTR-2024-${2000 + i}`,
                    type,
                    date: getRandomDate(),
                    status: DocStatus.PENDING,
                    partnerId: partner.id,
                    orderId: isSales && Math.random() > 0.7 && orders.length > 0 ? getRandomItem(orders).id : undefined,
                    items: {
                        create: itemsData
                    },
                    subTotal: subTotal,
                    taxTotal: subTotal * 0.20,
                    totalAmount: subTotal * 1.20
                }
            })

            // Transaction
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
