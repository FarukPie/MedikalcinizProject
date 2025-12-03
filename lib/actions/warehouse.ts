'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Warehouse, Product, Category } from '@prisma/client'

export async function getWarehousesWithStats(): Promise<(Warehouse & {
    products: (Omit<Product, 'buyPrice' | 'sellPrice'> & { buyPrice: number, sellPrice: number, category: Category | null })[];
    totalProducts: number;
    totalStock: number;
})[]> {
    try {
        const warehouses = await prisma.warehouse.findMany({
            include: {
                products: {
                    include: {
                        category: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return warehouses.map(warehouse => {
            const totalProducts = warehouse.products.length;
            const totalStock = warehouse.products.reduce((sum, product) => sum + product.stock, 0);

            // Serialize products to convert Decimal to number
            const serializedProducts = warehouse.products.map(product => ({
                ...product,
                buyPrice: Number(product.buyPrice),
                sellPrice: Number(product.sellPrice)
            }));

            return {
                ...warehouse,
                products: serializedProducts,
                totalProducts,
                totalStock
            };
        });
    } catch (error) {
        console.error('Error fetching warehouses:', error);
        return [];
    }
}

export async function getProductsByWarehouse(warehouseId: string) {
    try {
        const products = await prisma.product.findMany({
            where: { warehouseId },
            include: {
                category: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return products;
    } catch (error) {
        console.error('Error fetching products by warehouse:', error);
        return [];
    }
}

export async function createWarehouse(prevState: any, formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const shelfCount = parseInt(formData.get('shelfCount') as string) || 0;
        const rowCount = parseInt(formData.get('rowCount') as string) || 0;
        const description = formData.get('description') as string;

        if (!name) return { success: false, error: "Depo adı zorunludur." };

        await prisma.warehouse.create({
            data: {
                name,
                shelfCount,
                rowCount,
                description
            }
        });

        revalidatePath('/admin/depo');
        return { success: true, message: "Depo başarıyla oluşturuldu." };
    } catch (error: any) {
        console.error('Error creating warehouse:', error);
        return { success: false, error: "Depo oluşturulurken bir hata oluştu." };
    }
}

export async function updateWarehouse(prevState: any, formData: FormData) {
    try {
        const id = formData.get('id') as string;
        const name = formData.get('name') as string;
        const shelfCount = parseInt(formData.get('shelfCount') as string) || 0;
        const rowCount = parseInt(formData.get('rowCount') as string) || 0;
        const description = formData.get('description') as string;

        if (!id) return { success: false, error: "Depo ID bulunamadı." };
        if (!name) return { success: false, error: "Depo adı zorunludur." };

        await prisma.warehouse.update({
            where: { id },
            data: {
                name,
                shelfCount,
                rowCount,
                description
            }
        });

        revalidatePath('/admin/depo');
        return { success: true, message: "Depo başarıyla güncellendi." };
    } catch (error: any) {
        console.error('Error updating warehouse:', error);
        return { success: false, error: "Depo güncellenirken bir hata oluştu." };
    }
}

export async function deleteWarehouse(id: string) {
    try {
        // Check if warehouse has products
        const productCount = await prisma.product.count({
            where: { warehouseId: id }
        });

        if (productCount > 0) {
            return { success: false, error: "İçinde ürün olan depo silinemez!" };
        }

        await prisma.warehouse.delete({
            where: { id }
        });

        revalidatePath('/admin/depo');
        return { success: true, message: "Depo başarıyla silindi." };
    } catch (error: any) {
        console.error('Error deleting warehouse:', error);
        return { success: false, error: "Depo silinirken bir hata oluştu." };
    }
}
