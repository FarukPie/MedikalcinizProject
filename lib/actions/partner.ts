'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { PartnerType } from '@prisma/client'

export async function getPartners() {
    try {
        const partners = await prisma.partner.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        return partners.map((partner: any) => ({
            ...partner,
            balance: Number(partner.balance)
        }));
    } catch (error) {
        console.error('Error fetching partners:', error);
        return [];
    }
}

export async function createPartner(data: any) {
    try {
        const { name, type, vkn, contactName, phone, email, address, description } = data;

        // Map string type to Enum
        let partnerType: PartnerType = PartnerType.CUSTOMER;
        if (type === 'tedarikci') partnerType = PartnerType.SUPPLIER;
        if (type === 'hepsi') partnerType = PartnerType.BOTH;

        await prisma.partner.create({
            data: {
                name,
                type: partnerType,
                taxNumber: vkn,
                contactName,
                phone,
                email,
                address,
                // description field doesn't exist in schema, so we might need to omit it or add it to schema.
                // Checking schema: Partner model has: id, name, type, taxNumber, contactName, email, phone, address, balance.
                // No description field. I will ignore description for now or append to address if needed.
                // Let's ignore description for now as it's not in the schema.
            }
        });

        revalidatePath('/admin/cariler');
        revalidatePath('/admin/fatura'); // Partners are used in invoice dropdown
        revalidatePath('/admin/teklif'); // Partners are used in proposal dropdown

        return { success: true, message: "Cari başarıyla oluşturuldu." };
    } catch (error: any) {
        console.error('Error creating partner:', error);
        return { success: false, error: "Cari oluşturulurken bir hata oluştu: " + (error.message || error) };
    }
}

export async function updatePartner(id: string, data: any) {
    try {
        const { name, type, vkn, contactName, phone, email, address } = data;

        // Map string type to Enum
        let partnerType: PartnerType = PartnerType.CUSTOMER;
        if (type === 'tedarikci') partnerType = PartnerType.SUPPLIER;
        if (type === 'hepsi') partnerType = PartnerType.BOTH;

        await prisma.partner.update({
            where: { id },
            data: {
                name,
                type: partnerType,
                taxNumber: vkn,
                contactName,
                phone,
                email,
                address
            }
        });

        revalidatePath('/admin/cariler');
        revalidatePath('/admin/fatura');
        revalidatePath('/admin/teklif');

        return { success: true, message: "Cari başarıyla güncellendi." };
    } catch (error: any) {
        console.error('Error updating partner:', error);
        return { success: false, error: "Cari güncellenirken bir hata oluştu: " + (error.message || error) };
    }
}

export async function deletePartner(id: string) {
    try {
        await prisma.partner.delete({
            where: { id }
        });

        revalidatePath('/admin/cariler');
        revalidatePath('/admin/fatura');
        revalidatePath('/admin/teklif');

        return { success: true, message: "Cari başarıyla silindi." };
    } catch (error: any) {
        console.error('Error deleting partner:', error);
        return { success: false, error: "Cari silinirken bir hata oluştu: " + (error.message || error) };
    }
}
