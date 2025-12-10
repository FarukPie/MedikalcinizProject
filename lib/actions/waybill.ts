'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { DocStatus } from '@prisma/client'

export async function getWaybills() {
    try {
        const waybills = await prisma.waybill.findMany({
            include: {
                partner: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return waybills.map((waybill: any) => ({
            ...waybill,
            date: waybill.date.toLocaleDateString('tr-TR')
        }));
    } catch (error) {
        console.error('Error fetching waybills:', error);
        return [];
    }
}

export async function getWaybillFormData() {
    try {
        const partners = await prisma.partner.findMany({
            select: {
                id: true,
                name: true
            },
            orderBy: {
                name: 'asc'
            }
        });

        const products = await prisma.product.findMany({
            select: {
                id: true,
                name: true,
                code: true,
                unit: true
            },
            where: {
                isActive: true
            },
            orderBy: {
                name: 'asc'
            }
        });

        return { partners, products };
    } catch (error) {
        console.error('Error fetching waybill form data:', error);
        return { partners: [], products: [] };
    }
}

export async function createWaybill(data: any) {
    try {
        const { partnerId, type, date, notes, items } = data;

        // Generate a waybill number
        const count = await prisma.waybill.count();
        const number = `IRS-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

        await prisma.waybill.create({
            data: {
                number,
                type,
                date: new Date(date),
                notes,
                status: DocStatus.SENT,
                partnerId,
                items: {
                    create: items.map((item: any) => ({
                        productId: item.productId,
                        productName: item.productName || "",
                        quantity: Number(item.quantity),
                        unit: item.unit || "Adet",
                        description: item.description || ""
                    }))
                }
            }
        });

        revalidatePath('/admin/irsaliye');
        return { success: true, message: "İrsaliye başarıyla oluşturuldu." };
    } catch (error: any) {
        console.error('Error creating waybill:', error);
        return { success: false, error: "İrsaliye oluşturulurken bir hata oluştu: " + (error.message || error) };
    }
}

export async function deleteWaybill(id: string) {
    try {
        await prisma.waybill.delete({
            where: { id }
        });
        revalidatePath('/admin/irsaliye');
        return { success: true, message: "İrsaliye başarıyla silindi." };
    } catch (error: any) {
        console.error('Error deleting waybill:', error);
        return { success: false, error: "İrsaliye silinirken bir hata oluştu." };
    }
}

export async function getWaybillById(id: string) {
    try {
        const waybill = await prisma.waybill.findUnique({
            where: { id },
            include: {
                items: true,
                partner: {
                    select: {
                        id: true,
                        name: true,
                        taxNumber: true,
                        address: true,
                        phone: true,
                        email: true
                    }
                }
            }
        });

        if (!waybill) return null;

        return {
            ...waybill,
            // Format date for input[type="date"] (YYYY-MM-DD)
            date: waybill.date.toISOString().split('T')[0]
        };
    } catch (error) {
        console.error('Error fetching waybill:', error);
        return null;
    }
}

export async function updateWaybill(id: string, data: any) {
    try {
        const { partnerId, type, date, notes, items } = data;

        // Transaction to ensure atomicity
        await prisma.$transaction(async (tx: any) => {
            // 1. Update Waybill details
            await tx.waybill.update({
                where: { id },
                data: {
                    partnerId,
                    type,
                    date: new Date(date),
                    notes
                }
            });

            // 2. Delete existing items
            await tx.waybillItem.deleteMany({
                where: { waybillId: id }
            });

            // 3. Create new items
            if (items && items.length > 0) {
                await tx.waybillItem.createMany({
                    data: items.map((item: any) => ({
                        waybillId: id,
                        productId: item.productId,
                        productName: item.productName || "",
                        quantity: Number(item.quantity),
                        unit: item.unit || "Adet",
                        description: item.description || ""
                    }))
                });
            }
        });

        revalidatePath('/admin/irsaliye');
        return { success: true, message: "İrsaliye başarıyla güncellendi." };
    } catch (error: any) {
        console.error('Error updating waybill:', error);
        return { success: false, error: "İrsaliye güncellenirken bir hata oluştu: " + (error.message || error) };
    }
}
