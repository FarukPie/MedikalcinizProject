'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { DocStatus, TransactionType } from '@prisma/client'

export async function getInvoices() {
    try {
        const invoices = await prisma.invoice.findMany({
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

        return invoices.map((invoice: any) => ({
            ...invoice,
            date: invoice.date.toLocaleDateString('tr-TR'),
            dueDate: invoice.dueDate ? invoice.dueDate.toLocaleDateString('tr-TR') : '-',
            totalAmount: Number(invoice.totalAmount),
            taxTotal: Number(invoice.taxTotal),
            subTotal: Number(invoice.subTotal)
        }));
    } catch (error) {
        console.error('Error fetching invoices:', error);
        return [];
    }
}

export async function getInvoiceFormData() {
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

        return {
            partners,
            products: products.map((p: any) => ({
                ...p,
                sellPrice: Number(p.sellPrice)
            }))
        };
    } catch (error) {
        console.error('Error fetching invoice form data:', error);
        return { partners: [], products: [] };
    }
}

export async function createInvoice(data: any) {
    try {
        const { partnerId, type, date, dueDate, notes, items } = data;

        // 1. Calculate Totals
        let subTotal = 0;
        let taxTotal = 0;

        const processedItems = items.map((item: any) => {
            const quantity = Number(item.quantity);
            const price = Number(item.price);
            const taxRate = Number(item.taxRate);

            const lineTotal = quantity * price;
            const lineTax = lineTotal * (taxRate / 100);

            subTotal += lineTotal;
            taxTotal += lineTax;

            return {
                productId: item.productId,
                productName: item.productName,
                quantity,
                price,
                taxRate,
                total: lineTotal + lineTax
            };
        });

        const totalAmount = subTotal + taxTotal;

        // 2. Determine Transaction Type and Balance Update
        // Satış Faturası -> Partner Borçlanır (DEBT) -> Balance Increases (Positive)
        // Alış Faturası -> Partner Alacaklanır (CREDIT) -> Balance Decreases (Negative)
        const isSales = type === "Satış Faturası";
        const transactionType = isSales ? TransactionType.DEBT : TransactionType.CREDIT;

        // Generate Invoice Number
        const count = await prisma.invoice.count();
        const number = `FAT-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

        // 3. Database Transaction
        await prisma.$transaction(async (tx: any) => {
            // Create Invoice
            const invoice = await tx.invoice.create({
                data: {
                    number,
                    type,
                    date: new Date(date),
                    dueDate: dueDate ? new Date(dueDate) : null,
                    notes,
                    status: DocStatus.PENDING,
                    partnerId,
                    subTotal,
                    taxTotal,
                    totalAmount,
                    items: {
                        create: processedItems
                    }
                }
            });

            // Create Financial Transaction
            await tx.transaction.create({
                data: {
                    date: new Date(date),
                    description: `${type} - ${number}`,
                    type: transactionType,
                    amount: totalAmount,
                    partnerId,
                    invoiceId: invoice.id
                }
            });

            // Update Partner Balance
            if (isSales) {
                await tx.partner.update({
                    where: { id: partnerId },
                    data: { balance: { increment: totalAmount } }
                });
            } else {
                await tx.partner.update({
                    where: { id: partnerId },
                    data: { balance: { decrement: totalAmount } }
                });
            }
        });

        revalidatePath('/admin/fatura');
        revalidatePath('/admin/ekstre');
        revalidatePath('/admin/cariler');

        return { success: true, message: "Fatura başarıyla oluşturuldu." };
    } catch (error: any) {
        console.error('Error creating invoice:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        return { success: false, error: "Fatura oluşturulurken bir hata oluştu: " + (error.message || error) };
    }
}
