"use server";

import prisma from "@/lib/prisma";
import { StockMovementType } from "@prisma/client";
import { revalidatePath } from "next/cache";

type LogStockMovementParams = {
    productId: string;
    type: StockMovementType;
    quantity: number;
    oldStock: number;
    newStock: number;
    description?: string;
    tx?: any; // For transaction support
}

export async function logStockMovement({
    productId,
    type,
    quantity,
    oldStock,
    newStock,
    description,
    tx
}: LogStockMovementParams) {
    try {
        const client = tx || prisma;

        await client.stockMovement.create({
            data: {
                productId,
                type,
                quantity,
                oldStock,
                newStock,
                description
            }
        });

        return { success: true };
    } catch (error) {
        console.error('Error logging stock movement:', error);
        // Don't throw here to avoid failing entire transaction if logging fails, 
        // unless strict audit is required. For now, logging failure shouldn't block ops.
        return { success: false, error };
    }
}

export async function getStockMovements(productId: string) {
    try {
        const movements = await prisma.stockMovement.findMany({
            where: { productId },
            orderBy: { createdAt: 'desc' },
            include: {
                product: {
                    select: { name: true }
                }
            }
        });

        return movements.map(m => ({
            ...m,
            createdAt: m.createdAt.toLocaleString('tr-TR')
        }));
    } catch (error) {
        console.error('Error fetching stock movements:', error);
        return [];
    }
}
