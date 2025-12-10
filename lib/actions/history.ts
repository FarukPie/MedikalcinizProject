'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function logProductHistory(data: {
    action: string;
    productId: string;
    description?: string;
    oldValue?: string;
    newValue?: string;
    user?: string;
}) {
    try {
        await prisma.productHistory.create({
            data: {
                action: data.action,
                productId: data.productId,
                description: data.description,
                oldValue: data.oldValue,
                newValue: data.newValue,
                user: data.user || "Sistem"
            }
        });
        return { success: true };
    } catch (error) {
        console.error('Error logging product history:', error);
        return { success: false, error };
    }
}

export async function getProductHistory(limit = 50) {
    try {
        const history = await prisma.productHistory.findMany({
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                product: {
                    select: {
                        name: true,
                        code: true
                    }
                }
            }
        });

        return history;
    } catch (error) {
        console.error('Error fetching product history:', error);
        return [];
    }
}
