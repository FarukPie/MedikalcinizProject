'use server'

import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function getFeaturedProducts() {
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
        return products
    } catch (error) {
        console.error('Error fetching featured products:', error)
        return []
    }
}

export async function getAllCategories() {
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

export async function getProductById(id: string) {
    try {
        const product = await prisma.product.findUnique({
            where: {
                id: id,
            },
            include: {
                category: true,
            },
        })
        return product
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
}) {
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
        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}
