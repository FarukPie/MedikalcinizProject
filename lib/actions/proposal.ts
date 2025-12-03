'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { DocStatus } from '@prisma/client'

export async function getProposalFormData() {
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
                sellPrice: true,
                taxRate: true,
                unit: true
            },
            where: {
                isActive: true
            },
            orderBy: {
                name: 'asc'
            }
        });

        // Serialize Decimal to number for client components
        const serializedProducts = products.map((product: any) => ({
            ...product,
            sellPrice: Number(product.sellPrice.toString())
        }));

        return { partners, products: serializedProducts };
    } catch (error) {
        console.error('Error fetching proposal form data:', error);
        return { partners: [], products: [] };
    }
}

export async function createProposal(data: any) {
    console.log('createProposal: Called with data', JSON.stringify(data, null, 2));
    try {
        const { partnerId, date, validUntil, type, notes, items } = data;

        // Calculate total amount on server side
        let totalAmount = 0;
        const processedItems = items.map((item: any) => {
            const itemTotal = Number(item.price) * Number(item.quantity);
            totalAmount += itemTotal; // Note: This is a simplified total, usually includes tax

            // Calculate tax amount for each item if needed, but for now we just store the total
            // If the schema expects totalAmount to be subtotal + tax, we should calculate that.
            // Assuming item.price is unit price excluding tax.
            const taxAmount = itemTotal * (Number(item.taxRate) / 100);
            const itemGrandTotal = itemTotal + taxAmount;

            return {
                productId: item.productId,
                productName: item.productName || "", // Fallback if not provided, but should be
                quantity: Number(item.quantity),
                price: Number(item.price),
                taxRate: Number(item.taxRate),
                total: itemTotal // Storing line total (usually quantity * price)
            };
        });

        // Recalculate total amount including tax for the proposal header
        const grandTotal = processedItems.reduce((acc: number, item: any) => {
            const itemTotal = item.price * item.quantity;
            const itemTax = itemTotal * (item.taxRate / 100);
            return acc + itemTotal + itemTax;
        }, 0);

        // Generate a proposal number (simplified)
        const count = await prisma.proposal.count();
        const number = `TEK-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

        await prisma.proposal.create({
            data: {
                number,
                date: new Date(date),
                validUntil: validUntil ? new Date(validUntil) : null,
                status: DocStatus.DRAFT, // Default status
                partnerId,
                type,
                totalAmount: grandTotal,
                items: {
                    create: processedItems
                }
            }
        });

        revalidatePath('/admin/teklif');
        return { success: true, message: "Teklif başarıyla oluşturuldu." };
    } catch (error: any) {
        console.error('Error creating proposal:', error);
        return { success: false, error: "Teklif oluşturulurken bir hata oluştu." };
    }
}

export async function getProposals() {
    try {
        const proposals = await prisma.proposal.findMany({
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

        return proposals.map((proposal: any) => ({
            ...proposal,
            totalAmount: Number(proposal.totalAmount),
            date: proposal.date.toLocaleDateString('tr-TR'),
            // ValidUntil might be null
            validUntil: proposal.validUntil ? proposal.validUntil.toLocaleDateString('tr-TR') : '-',
        }));
    } catch (error) {
        console.error('Error fetching proposals:', error);
        return [];
    }
}
