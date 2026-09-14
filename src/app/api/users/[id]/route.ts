import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { auditService } from '@/services/audit.service'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().nullable().optional(),
  roleId: z.string().optional(),
  isActive: z.boolean().optional(),
  newPassword: z.string().min(6).optional(),
})

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { id } = await params
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        role: {
          include: { permissions: true },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        isActive: user.isActive,
        createdAt: user.createdAt,
        role: user.role,
      },
    })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Only Super Admin can update other users
    const isSuperAdmin = session.role.name === 'Super Admin'
    const { id } = await params

    if (!isSuperAdmin && session.id !== id) {
      return NextResponse.json({ error: 'Permissions insuffisantes' }, { status: 403 })
    }

    const body = await request.json()
    const parsed = updateUserSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Données invalides' },
        { status: 400 }
      )
    }

    const { name, email, phone, roleId, isActive, newPassword } = parsed.data

    const updateData: {
      name?: string
      email?: string
      phone?: string | null
      roleId?: string
      isActive?: boolean
      passwordHash?: string
    } = {}

    if (name) updateData.name = name.trim()
    if (phone !== undefined) updateData.phone = phone ? phone.trim() : null
    if (isActive !== undefined && isSuperAdmin) updateData.isActive = isActive
    if (roleId && isSuperAdmin) updateData.roleId = roleId

    if (email) {
      const existing = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      })
      if (existing && existing.id !== id) {
        return NextResponse.json(
          { error: 'Cette adresse email est déjà utilisée.' },
          { status: 400 }
        )
      }
      updateData.email = email.toLowerCase()
    }

    if (newPassword) {
      updateData.passwordHash = await hashPassword(newPassword)
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      include: { role: true },
    })

    await auditService.log({
      action: 'USER_UPDATED',
      entityType: 'User',
      entityId: id,
      details: `Mise à jour du compte de ${updated.name} (${updated.email})`,
      userId: session.id,
    })

    return NextResponse.json({
      success: true,
      message: 'Utilisateur mis à jour avec succès.',
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        isActive: updated.isActive,
        role: updated.role.name,
      },
    })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}
