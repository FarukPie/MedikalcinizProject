'use server'

import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { UserRole } from "@prisma/client"

export async function registerUser(prevState: any, formData: FormData) {
    try {
        const firstName = formData.get("firstName") as string
        const lastName = formData.get("lastName") as string
        const email = formData.get("email") as string
        const phone = formData.get("phone") as string
        const password = formData.get("password") as string
        const confirmPassword = formData.get("confirmPassword") as string

        // Validation
        if (!email || !password || !firstName || !lastName || !phone) {
            return { success: false, message: "Lütfen tüm alanları doldurunuz." }
        }

        if (password !== confirmPassword) {
            return { success: false, message: "Şifreler eşleşmiyor." }
        }

        if (password.length < 6) {
            return { success: false, message: "Şifre en az 6 karakter olmalıdır." }
        }

        if (!/[A-Z]/.test(password)) {
            return { success: false, message: "Şifre en az bir büyük harf içermelidir." }
        }

        if (!/[a-z]/.test(password)) {
            return { success: false, message: "Şifre en az bir küçük harf içermelidir." }
        }

        if (!/[0-9]/.test(password)) {
            return { success: false, message: "Şifre en az bir rakam içermelidir." }
        }

        // Check if email exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return { success: false, message: "Bu e-posta adresi ile kayıtlı bir kullanıcı zaten var." }
        }

        // Find "Müşteri" Role
        const customerRole = await prisma.role.findUnique({
            where: { name: 'Müşteri' }
        })

        if (!customerRole) {
            console.error("Müşteri role not found in database during registration.")
            return { success: false, message: "Sistem hatası: Varsayılan rol bulunamadı. Lütfen yönetici ile iletişime geçin." }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create User
        await prisma.user.create({
            data: {
                name: firstName,
                surname: lastName,
                email,
                phone,
                password: hashedPassword,
                role: UserRole.CUSTOMER, // Enum role
                assignedRoleId: customerRole.id // Relation role
            }
        })

        return { success: true, message: "Hesabınız başarıyla oluşturuldu. Giriş yapabilirsiniz." }

    } catch (error) {
        console.error("Error registering user:", error)
        return { success: false, message: "Kayıt işlemi sırasında bir hata oluştu." }
    }
}
