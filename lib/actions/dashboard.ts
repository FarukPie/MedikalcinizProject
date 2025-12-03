'use server'

import prisma from '@/lib/prisma'
import { PartnerType, DocStatus } from '@prisma/client'

export async function getDashboardStats() {
    try {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // 1. Total Stock Value
        const products = await prisma.product.findMany({
            select: {
                stock: true,
                buyPrice: true
            }
        });

        const totalStockValue = products.reduce((sum: number, product: any) => {
            return sum + (product.stock * Number(product.buyPrice));
        }, 0);

        // 2. Active Customers
        const activeCustomers = await prisma.partner.count({
            where: {
                type: {
                    in: [PartnerType.CUSTOMER, PartnerType.BOTH]
                }
            }
        });

        // 3. Sales & Purchases (Daily & Monthly)
        // Daily Sales
        const dailySales = await prisma.invoice.aggregate({
            _sum: { totalAmount: true },
            where: {
                type: "Satış Faturası",
                date: { gte: startOfDay }
            }
        });

        // Monthly Sales
        const monthlySales = await prisma.invoice.aggregate({
            _sum: { totalAmount: true },
            where: {
                type: "Satış Faturası",
                date: { gte: startOfMonth }
            }
        });

        // Daily Purchase
        const dailyPurchase = await prisma.invoice.aggregate({
            _sum: { totalAmount: true },
            where: {
                type: "Alış Faturası",
                date: { gte: startOfDay }
            }
        });

        // Monthly Purchase
        const monthlyPurchase = await prisma.invoice.aggregate({
            _sum: { totalAmount: true },
            where: {
                type: "Alış Faturası",
                date: { gte: startOfMonth }
            }
        });

        // 4. Total Products
        const totalProducts = await prisma.product.count({
            where: { isActive: true }
        });

        // 5. Active Proposals (Offers)
        const activeProposals = await prisma.proposal.count({
            where: { status: { in: [DocStatus.SENT, DocStatus.DRAFT] } }
        });

        // 6. Recent Orders
        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                partner: {
                    select: { name: true }
                }
            }
        });

        // 7. Chart Data (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1); // Start of that month

        const chartInvoices = await prisma.invoice.findMany({
            where: {
                date: { gte: sixMonthsAgo }
            },
            select: {
                date: true,
                type: true,
                totalAmount: true
            }
        });

        const chartDataMap = new Map<string, { name: string, satis: number, alis: number }>();

        // Initialize last 6 months
        for (let i = 0; i < 6; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const key = `${d.getFullYear()}-${d.getMonth()}`;
            const monthName = d.toLocaleString('tr-TR', { month: 'short' });
            chartDataMap.set(key, { name: monthName, satis: 0, alis: 0 });
        }

        chartInvoices.forEach((inv: any) => {
            const d = new Date(inv.date);
            const key = `${d.getFullYear()}-${d.getMonth()}`;

            if (chartDataMap.has(key)) {
                const entry = chartDataMap.get(key)!;
                const amount = Number(inv.totalAmount);
                if (inv.type === "Satış Faturası") {
                    entry.satis += amount;
                } else if (inv.type === "Alış Faturası") {
                    entry.alis += amount;
                }
            }
        });

        // Convert map to array and reverse to show oldest to newest
        const chartData = Array.from(chartDataMap.values()).reverse();


        return {
            stats: {
                totalStockValue,
                activeCustomers,
                dailySales: Number(dailySales._sum.totalAmount || 0),
                monthlySales: Number(monthlySales._sum.totalAmount || 0),
                dailyPurchase: Number(dailyPurchase._sum.totalAmount || 0),
                monthlyPurchase: Number(monthlyPurchase._sum.totalAmount || 0),
                totalProducts,
                activeProposals
            },
            recentOrders: recentOrders.map((order: any) => ({
                id: order.number,
                customer: order.partner.name,
                amount: Number(order.totalAmount),
                status: order.status,
                createdAt: order.createdAt
            })),
            chartData
        };

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return {
            stats: {
                totalStockValue: 0,
                activeCustomers: 0,
                dailySales: 0,
                monthlySales: 0,
                dailyPurchase: 0,
                monthlyPurchase: 0,
                totalProducts: 0,
                activeProposals: 0
            },
            recentOrders: [],
            chartData: []
        };
    }
}
