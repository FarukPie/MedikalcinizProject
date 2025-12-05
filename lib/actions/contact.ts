'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const ContactFormSchema = z.object({
    firstName: z.string().min(2, "Ad en az 2 karakter olmalıdır."),
    lastName: z.string().min(2, "Soyad en az 2 karakter olmalıdır."),
    email: z.string().email("Geçerli bir e-posta adresi giriniz."),
    subject: z.string().optional(),
    message: z.string().min(10, "Mesaj en az 10 karakter olmalıdır."),
})

export async function submitContactForm(prevState: any, formData: FormData) {
    try {
        const rawData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
        }

        const validatedFields = ContactFormSchema.safeParse(rawData)

        if (!validatedFields.success) {
            return {
                success: false,
                errors: validatedFields.error.flatten().fieldErrors,
                message: "Lütfen form alanlarını kontrol ediniz."
            }
        }

        await prisma.contactMessage.create({
            data: {
                firstName: validatedFields.data.firstName,
                lastName: validatedFields.data.lastName,
                email: validatedFields.data.email,
                subject: validatedFields.data.subject || null,
                message: validatedFields.data.message,
            }
        })

        revalidatePath('/admin/mesajlar')
        return { success: true, message: "Mesajınız iletildi" }
    } catch (error) {
        console.error('Error submitting contact form:', error)
        return { success: false, message: `Bir hata oluştu: ${(error as Error).message}` }
    }
}

export async function getContactMessages() {
    try {
        const messages = await prisma.contactMessage.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })
        return messages
    } catch (error) {
        console.error('Error fetching contact messages:', error)
        return []
    }
}

export async function markMessageAsRead(id: string) {
    try {
        await prisma.contactMessage.update({
            where: { id },
            data: { isRead: true }
        })
        revalidatePath('/admin/mesajlar')
        return { success: true }
    } catch (error) {
        console.error('Error marking message as read:', error)
        return { success: false }
    }
}

export async function deleteMessage(id: string) {
    try {
        await prisma.contactMessage.delete({
            where: { id }
        })
        revalidatePath('/admin/mesajlar')
        return { success: true }
    } catch (error) {
        console.error('Error deleting message:', error)
        return { success: false }
    }
}
