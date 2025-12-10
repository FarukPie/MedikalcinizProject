'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { UserRole, User, Prisma } from "@prisma/client"

export async function getUsers(): Promise<User[]> {
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })
        return users
    } catch (error) {
        console.error("Error fetching users:", error)
        return []
    }
}

export async function createUser(formData: FormData) {
    try {
        const name = formData.get("name") as string
        const surname = formData.get("surname") as string
        const email = formData.get("email") as string
        const phone = formData.get("phone") as string
        const password = formData.get("password") as string
        const roleId = formData.get("role") as string
        const company = formData.get("company") as string
        const description = formData.get("description") as string

        // Validation
        if (!email || !password || !name || !surname || !roleId) {
            return { success: false, message: "Lütfen tüm zorunlu alanları doldurunuz." }
        }

        // Check if email exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return { success: false, message: "Bu e-posta adresi ile kayıtlı bir kullanıcı zaten var." }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Find Role record
        let userRole: UserRole = UserRole.CUSTOMER
        let assignedRoleId = null

        try {
            const roleRecord = await prisma.role.findUnique({
                where: { id: roleId }
            })

            if (roleRecord) {
                assignedRoleId = roleRecord.id

                // Map Role name to UserRole enum for backward compatibility / permissions
                if (roleRecord.name === 'Yönetici' || roleRecord.name === 'Admin') userRole = UserRole.ADMIN
                else if (roleRecord.name === 'Satışçı' || roleRecord.name === 'Sales') userRole = UserRole.SALES
                else userRole = UserRole.CUSTOMER
            } else {
                return { success: false, message: "Seçilen rol bulunamadı." }
            }
        } catch (e) {
            console.warn("Could not find role record for", roleId)
            return { success: false, message: "Rol bilgisi alınamadı." }
        }

        // Create User
        await prisma.user.create({
            data: {
                name,
                surname,
                email,
                phone,
                password: hashedPassword,
                role: userRole,
                company,
                assignedRoleId: assignedRoleId
            }
        })

        revalidatePath('/admin/users')
        return { success: true, message: "Kullanıcı başarıyla oluşturuldu." }

    } catch (error) {
        console.error("Error creating user:", error)
        return { success: false, message: "Kullanıcı oluşturulurken bir hata oluştu." }
    }
}

export async function deleteUser(userId: string) {
    try {
        await prisma.user.delete({
            where: { id: userId }
        })

        revalidatePath('/admin/users')
        return { success: true, message: 'Kullanıcı silindi.' }
    } catch (error) {
        console.error("Error deleting user:", error)
        return { success: false, message: 'Kullanıcı silinirken bir hata oluştu.' }
    }
}

export async function updateUser(formData: FormData) {
    try {
        const id = formData.get("id") as string
        const name = formData.get("name") as string
        const surname = formData.get("surname") as string
        const email = formData.get("email") as string
        const phone = formData.get("phone") as string
        const password = formData.get("password") as string
        const roleId = formData.get("role") as string
        const company = formData.get("company") as string
        const description = formData.get("description") as string

        // Validation
        if (!id || !email || !name || !surname || !roleId) {
            return { success: false, message: "Lütfen tüm zorunlu alanları doldurunuz." }
        }

        // Check if email exists (excluding current user)
        const existingUser = await prisma.user.findFirst({
            where: {
                email,
                NOT: { id }
            }
        })

        if (existingUser) {
            return { success: false, message: "Bu e-posta adresi ile kayıtlı başka bir kullanıcı var." }
        }

        // Find Role record
        let userRole: UserRole = UserRole.CUSTOMER
        let assignedRoleId = null

        try {
            const roleRecord = await prisma.role.findUnique({
                where: { id: roleId }
            })

            if (roleRecord) {
                assignedRoleId = roleRecord.id

                // Map Role name to UserRole enum
                if (roleRecord.name === 'Yönetici' || roleRecord.name === 'Admin') userRole = UserRole.ADMIN
                else if (roleRecord.name === 'Satışçı' || roleRecord.name === 'Sales') userRole = UserRole.SALES
                else userRole = UserRole.CUSTOMER
            } else {
                // Keep existing role if not found? Or return error? 
                // Based on plan, we expect a valid ID.
                return { success: false, message: "Seçilen rol bulunamadı." }
            }
        } catch (e) {
            console.warn("Could not find role record for", roleId)
            return { success: false, message: "Rol bilgisi alınamadı." }
        }

        // Prepare update data
        const updateData: Prisma.UserUpdateInput = {
            name,
            surname,
            email,
            phone,
            company,
            role: userRole,
            assignedRole: assignedRoleId ? { connect: { id: assignedRoleId } } : { disconnect: true }
        }

        // Handle password
        if (password && password.trim() !== "") {
            updateData.password = await bcrypt.hash(password, 10)
        }

        // Update User
        await prisma.user.update({
            where: { id },
            data: updateData
        })

        revalidatePath('/admin/users')
        return { success: true, message: "Kullanıcı başarıyla güncellendi." }

    } catch (error) {
        console.error("Error updating user:", error)
        return { success: false, message: "Kullanıcı güncellenirken bir hata oluştu." }
    }
}
