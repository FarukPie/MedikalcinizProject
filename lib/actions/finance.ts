'use server'

import prisma from '@/lib/prisma'
import { TransactionType } from '@prisma/client'

export async function getFinanceData() {
    try {
        // Fetch transactions ordered by date ASCENDING to calculate running balance easily
        const transactions = await prisma.transaction.findMany({
            include: {
                partner: {
                    select: {
                        name: true
                    }
                },
                invoice: {
                    include: {
                        order: {
                            select: {
                                number: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                date: 'asc'
            }
        });

        let runningBalance = 0;
        let totalDebt = 0;
        let totalCredit = 0;

        // Calculate running balance and stats
        const transactionsWithBalance = transactions.map((t: any) => {
            const amount = Number(t.amount);

            if (t.type === TransactionType.DEBT) {
                runningBalance += amount;
                totalDebt += amount;
            } else {
                runningBalance -= amount;
                totalCredit += amount;
            }

            return {
                ...t,
                amount: amount,
                balance: runningBalance,
                partnerName: t.partner.name,
                orderNumber: t.invoice?.order?.number,
                invoiceNumber: t.invoice?.number
            };
        });

        // Reverse to show newest first
        transactionsWithBalance.reverse();

        return {
            stats: {
                totalDebt,
                totalCredit,
                currentBalance: runningBalance, // Final running balance is the current balance
                transactionCount: transactions.length
            },
            transactions: transactionsWithBalance
        };

    } catch (error) {
        console.error("Error fetching finance data:", error);
        return {
            stats: {
                totalDebt: 0,
                totalCredit: 0,
                currentBalance: 0,
                transactionCount: 0
            },
            transactions: []
        };
    }
}
