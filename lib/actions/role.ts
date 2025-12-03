"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createRole(data: {
    name: string;
    description?: string;
    permissions: Record<string, Record<string, boolean>>;
}) {
    try {
        if (!data.name) {
            return { success: false, error: "Rol adı zorunludur." };
        }

        // Check if role name already exists
        const existingRole = await prisma.role.findUnique({
            where: { name: data.name },
        });

        if (existingRole) {
            return { success: false, error: "Bu isimde bir rol zaten mevcut." };
        }

        await prisma.role.create({
            data: {
                name: data.name,
                description: data.description,
                permissions: data.permissions,
            },
        });

        revalidatePath("/admin/roles");
        return { success: true, message: "Rol başarıyla oluşturuldu." };
    } catch (error: any) {
        console.error("Role creation error:", error);
        return { success: false, error: error.message || "Rol oluşturulurken bir hata oluştu." };
    }
}

export async function deleteRole(roleId: string) {
    try {
        // Optional: Check if users are assigned to this role
        // const usersWithRole = await prisma.user.findFirst({ where: { assignedRoleId: roleId } });
        // if (usersWithRole) {
        //     return { success: false, error: "Bu role atanmış kullanıcılar var. Önce kullanıcıların rolünü değiştirin." };
        // }

        await prisma.role.delete({
            where: { id: roleId },
        });

        revalidatePath("/admin/roles");
        return { success: true, message: "Rol başarıyla silindi." };
    } catch (error: any) {
        console.error("Role deletion error:", error);
        return { success: false, error: "Rol silinirken bir hata oluştu." };
    }
}

export async function updateRole(roleId: string, data: {
    name: string;
    description?: string;
    permissions: Record<string, Record<string, boolean>>;
}) {
    try {
        if (!data.name) {
            return { success: false, error: "Rol adı zorunludur." };
        }

        // Check if role name exists (excluding current role)
        const existingRole = await prisma.role.findFirst({
            where: {
                name: data.name,
                NOT: { id: roleId },
            },
        });

        if (existingRole) {
            return { success: false, error: "Bu isimde başka bir rol zaten mevcut." };
        }

        await prisma.role.update({
            where: { id: roleId },
            data: {
                name: data.name,
                description: data.description,
                permissions: data.permissions,
            },
        });

        revalidatePath("/admin/roles");
        return { success: true, message: "Rol başarıyla güncellendi." };
    } catch (error: any) {
        console.error("Role update error:", error);
        return { success: false, error: "Rol güncellenirken bir hata oluştu." };
    }
}
