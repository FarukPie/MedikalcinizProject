'use server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Product, Category } from '@prisma/client'

export async function createProduct(data: any) {
    try {
        await prisma.product.create({
            data: {
                code: data.code,
                name: data.name,
                barcode: data.barcode || null,
                description: data.description || null,
                image: data.image || null,
                categoryId: data.categoryId || null,
                warehouseId: data.warehouseId || null,
                stock: parseInt(data.stock) || 0,
                minStock: parseInt(data.minStock) || 0,
                unit: data.unit || "Adet",
                buyPrice: parseFloat(data.buyPrice) || 0,
                sellPrice: parseFloat(data.sellPrice) || 0,
                taxRate: parseInt(data.taxRate) || 18,
                isActive: data.isActive === 'active' || data.isActive === true,
            },
        })
        revalidatePath('/admin/products')
        return { success: true, message: "Ürün başarıyla oluşturuldu." }
    } catch (error: any) {
        console.error('Error creating product:', error)
        return { success: false, error: error.message || "Ürün oluşturulurken bir hata oluştu." }
    }
}

export async function updateProduct(id: string, data: any) {
    try {
        await prisma.product.update({
            where: { id },
            data: {
                code: data.code,
                name: data.name,
                barcode: data.barcode || null,
                description: data.description || null,
                image: data.image || null,
                categoryId: data.categoryId || null,
                warehouseId: data.warehouseId || null,
                stock: parseInt(data.stock) || 0,
                minStock: parseInt(data.minStock) || 0,
                unit: data.unit || "Adet",
                buyPrice: parseFloat(data.buyPrice) || 0,
                sellPrice: parseFloat(data.sellPrice) || 0,
                taxRate: parseInt(data.taxRate) || 18,
                isActive: data.isActive === 'active' || data.isActive === true,
            },
        })
        revalidatePath('/admin/products')
        return { success: true, message: "Ürün başarıyla güncellendi." }
    } catch (error: any) {
        console.error('Error updating product:', error)
        return { success: false, error: error.message || "Ürün güncellenirken bir hata oluştu." }
    }
}

export async function deleteProduct(id: string) {
    try {
        await prisma.product.delete({
            where: { id },
        })
        revalidatePath('/admin/products')
        return { success: true, message: "Ürün başarıyla silindi." }
    } catch (error: any) {
        console.error('Error deleting product:', error)
        return { success: false, error: error.message || "Ürün silinirken bir hata oluştu." }
    }
}

export async function getFeaturedProducts(): Promise<(Omit<Product, 'buyPrice' | 'sellPrice'> & { buyPrice: number, sellPrice: number, price: number, category: Category | null })[]> {
    try {
        const products = await prisma.product.findMany({
            where: {
                isFeatured: true,
                isActive: true,
            },
            take: 8,
            include: {
                category: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
        return products.map((product: Product & { category: Category | null }) => ({
            ...product,
            buyPrice: Number(product.buyPrice),
            sellPrice: Number(product.sellPrice),
            price: Number(product.sellPrice)
        }))
    } catch (error) {
        console.error('Error fetching featured products:', error)
        return []
    }
}

export async function getLatestProducts(): Promise<(Omit<Product, 'buyPrice' | 'sellPrice'> & { buyPrice: number, sellPrice: number, price: number, category: Category | null })[]> {
    try {
        const products = await prisma.product.findMany({
            where: {
                isActive: true,
            },
            take: 8,
            include: {
                category: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
        return products.map((product: Product & { category: Category | null }) => ({
            ...product,
            buyPrice: Number(product.buyPrice),
            sellPrice: Number(product.sellPrice),
            price: Number(product.sellPrice)
        }))
    } catch (error) {
        console.error('Error fetching latest products:', error)
        return []
    }
}

export async function getBestSellingProducts(): Promise<(Omit<Product, 'buyPrice' | 'sellPrice'> & { buyPrice: number, sellPrice: number, price: number, category: Category | null })[]> {
    try {
        // Group by productId and sum quantity
        const topSellingItems = await prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: {
                quantity: true,
            },
            orderBy: {
                _sum: {
                    quantity: 'desc',
                },
            },
            take: 4,
            where: {
                productId: {
                    not: null
                }
            }
        });

        // Get product IDs
        const productIds = topSellingItems
            .map(item => item.productId)
            .filter((id): id is string => id !== null);

        if (productIds.length === 0) {
            return [];
        }

        // Fetch product details
        const products = await prisma.product.findMany({
            where: {
                id: {
                    in: productIds,
                },
                isActive: true,
            },
            include: {
                category: true,
            },
        });

        // Sort products to match the order of topSellingItems
        const sortedProducts = productIds
            .map(id => products.find(p => p.id === id))
            .filter((p): p is (Product & { category: Category | null }) => p !== undefined);

        return sortedProducts.map((product) => ({
            ...product,
            buyPrice: Number(product.buyPrice),
            sellPrice: Number(product.sellPrice),
            price: Number(product.sellPrice)
        }));
    } catch (error) {
        console.error('Error fetching best selling products:', error);
        return [];
    }
}

export async function getAllCategories(): Promise<Category[]> {
    try {
        const categories = await prisma.category.findMany({
            orderBy: {
                name: 'asc',
            },
        })
        return categories
    } catch (error) {
        console.error('Error fetching categories:', error)
        return []
    }
}

export async function getWarehouses() {
    try {
        const warehouses = await prisma.warehouse.findMany({
            orderBy: {
                name: 'asc',
            },
        })
        return warehouses
    } catch (error) {
        console.error('Error fetching warehouses:', error)
        return []
    }
}

export async function getProductById(id: string): Promise<(Omit<Product, 'buyPrice' | 'sellPrice'> & { buyPrice: number, sellPrice: number, price: number, category: Category | null }) | null> {
    try {
        const product = await prisma.product.findUnique({
            where: {
                id: id,
            },
            include: {
                category: true,
            },
        })
        if (!product) return null
        return {
            ...product,
            buyPrice: Number(product.buyPrice),
            sellPrice: Number(product.sellPrice),
            price: Number(product.sellPrice)
        }
    } catch (error) {
        console.error(`Error fetching product with id ${id}:`, error)
        return null
    }
}

export async function getProducts({
    search,
    category,
}: {
    search?: string;
    category?: string;
}): Promise<(Omit<Product, 'buyPrice' | 'sellPrice'> & { buyPrice: number, sellPrice: number, price: number, category: Category | null })[]> {
    try {
        const products = await prisma.product.findMany({
            where: {
                isActive: true,
                AND: [
                    // Category Filter
                    category ? { category: { slug: category } } : {},
                    // Search Filter (Name OR Description)
                    search
                        ? {
                            OR: [
                                { name: { contains: search, mode: 'insensitive' } },
                                { description: { contains: search, mode: 'insensitive' } },
                            ],
                        }
                        : {},
                ],
            },
            include: { category: true },
            orderBy: { createdAt: 'desc' },
        });
        return products.map((product: Product & { category: Category | null }) => ({
            ...product,
            buyPrice: Number(product.buyPrice),
            sellPrice: Number(product.sellPrice),
            price: Number(product.sellPrice)
        }));
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

export async function updateProductStock(prevState: any, formData: FormData) {
    try {
        const productId = formData.get("productId") as string;
        const type = formData.get("type") as string;
        const quantity = parseInt(formData.get("quantity") as string);
        const description = formData.get("description") as string;

        if (!productId) return { success: false, error: "Ürün seçilmedi." };
        if (!quantity || quantity <= 0) return { success: false, error: "Geçersiz miktar." };
        if (!type) return { success: false, error: "İşlem tipi seçilmedi." };

        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) return { success: false, error: "Ürün bulunamadı." };

        if (type === "out") {
            if (product.stock < quantity) {
                return { success: false, error: "Yetersiz stok!" };
            }
            await prisma.product.update({
                where: { id: productId },
                data: { stock: { decrement: quantity } }
            });
        } else if (type === "in") {
            await prisma.product.update({
                where: { id: productId },
                data: { stock: { increment: quantity } }
            });
        } else {
            return { success: false, error: "Geçersiz işlem tipi." };
        }

        revalidatePath('/admin/products');
        return { success: true, message: "Stok güncellendi." };
    } catch (error: any) {
        console.error("Error updating stock:", error);
        return { success: false, error: "Stok güncellenirken bir hata oluştu." };
    }
}

export async function setProductStock(prevState: any, formData: FormData) {
    try {
        const productId = formData.get("productId") as string;
        const quantity = parseInt(formData.get("quantity") as string);

        if (!productId) return { success: false, error: "Ürün seçilmedi." };
        if (isNaN(quantity) || quantity < 0) return { success: false, error: "Geçersiz miktar." };

        await prisma.product.update({
            where: { id: productId },
            data: { stock: quantity }
        });

        revalidatePath('/admin/products');
        return { success: true, message: "Sayım işlendi. Stok güncellendi." };
    } catch (error: any) {
        console.error("Error setting stock:", error);
        return { success: false, error: "Stok güncellenirken bir hata oluştu." };
    }
}
