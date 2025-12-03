'use server'

import prisma from '@/lib/prisma'
import { DocStatus } from '@prisma/client'

export async function getOrdersWithStats() {
    try {
        // 1. Fetch Orders with relations
        const orders = await prisma.order.findMany({
            include: {
                partner: {
                    select: {
                        name: true
                    }
                },
                _count: {
                    select: {
                        items: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // 2. Calculate Stats
        const totalOrders = orders.length;

        const totalAmount = orders.reduce((sum: number, order: any) => {
            return sum + Number(order.totalAmount);
        }, 0);

        const pendingCount = orders.filter((o: any) => o.status === DocStatus.PENDING).length;

        const completedCount = orders.filter((o: any) =>
            o.status === DocStatus.COMPLETED
        ).length;

        // Serialize Decimal to Number for client
        const serializedOrders = orders.map((order: any) => ({
            ...order,
            totalAmount: Number(order.totalAmount),
            partnerName: order.partner.name,
            itemCount: order._count.items
        }));

        return {
            orders: serializedOrders,
            stats: {
                totalOrders,
                totalAmount,
                pendingCount,
                completedCount
            }
        };

    } catch (error) {
        console.error('Error fetching orders:', error);
        return {
            orders: [],
            stats: {
                totalOrders: 0,
                totalAmount: 0,
                pendingCount: 0,
                completedCount: 0
            }
        };
    }
}
