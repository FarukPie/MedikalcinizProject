'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { UserRole } from "@prisma/client"

export async function getUsers() {
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
        const roleName = formData.get("role") as string
        const company = formData.get("company") as string
        const description = formData.get("description") as string

        // Validation
        if (!email || !password || !name || !surname || !roleName) {
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

        // Map form role to UserRole enum
        let userRole: UserRole = UserRole.CUSTOMER
        if (roleName === 'admin') userRole = UserRole.ADMIN
        if (roleName === 'sales') userRole = UserRole.SALES

        // Find corresponding Role record for permissions
        let assignedRoleId = null
        try {
            // Capitalize first letter for Role name search (e.g. "admin" -> "Admin")
            const roleSearchName = roleName.charAt(0).toUpperCase() + roleName.slice(1)
            const roleRecord = await prisma.role.findUnique({
                where: { name: roleSearchName }
            })
            if (roleRecord) {
                assignedRoleId = roleRecord.id
            }
        } catch (e) {
            console.warn("Could not find role record for", roleName)
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
        const roleName = formData.get("role") as string
        const company = formData.get("company") as string
        const description = formData.get("description") as string

        // Validation
        if (!id || !email || !name || !surname || !roleName) {
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

        // Prepare update data
        const updateData: any = {
            name,
            surname,
            email,
            phone,
            company,
            // description is not in User model based on previous read, but was in create? 
            // Wait, createUser had description but schema didn't show it in User model in previous read.
            // Let me check schema again. User model has: id, email, password, name, surname, phone, company, role, createdAt, updatedAt, assignedRoleId.
            // It does NOT have description. The createUser function was getting description but likely ignoring it or I missed it in schema.
            // Re-reading schema... User model: id, email, password, name, surname, phone, company, role...
            // It seems description is NOT in User model. I will ignore it for now or check if I missed it.
            // Actually, looking at createUser in previous turn, it extracts description but doesn't use it in prisma.user.create data.
            // So I will ignore description here too.
        }

        // Handle password
        if (password && password.trim() !== "") {
            updateData.password = await bcrypt.hash(password, 10)
        }

        // Map form role to UserRole enum
        let userRole: UserRole = UserRole.CUSTOMER
        if (roleName === 'admin') userRole = UserRole.ADMIN
        if (roleName === 'sales') userRole = UserRole.SALES
        updateData.role = userRole

        // Find corresponding Role record for permissions
        let assignedRoleId = null
        try {
            const roleSearchName = roleName.charAt(0).toUpperCase() + roleName.slice(1)
            const roleRecord = await prisma.role.findUnique({
                where: { name: roleSearchName }
            })
            if (roleRecord) {
                assignedRoleId = roleRecord.id
            }
        } catch (e) {
            console.warn("Could not find role record for", roleName)
        }
        updateData.assignedRoleId = assignedRoleId

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
