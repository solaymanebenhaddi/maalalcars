import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/db'
import { verifyPassword, hashPassword } from '@/lib/auth'
import { auditService } from '@/services/audit.service'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').optional(),
  email: z.string().email('Adresse email invalide').optional(),
  phone: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères').optional(),
})

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié. Veuillez vous connecter.' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
        role: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error: unknown) {
    console.error('Erreur GET /api/profile:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié. Veuillez vous connecter.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const parsed = updateProfileSchema.safeParse(body)

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]
      return NextResponse.json(
        { error: firstIssue?.message || 'Données invalides' },
        { status: 400 }
      )
    }

    const { name, email, phone, avatarUrl, currentPassword, newPassword } = parsed.data

    // 1. Fetch user from DB including passwordHash
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      include: { role: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
    }

    const updateData: {
      name?: string
      email?: string
      phone?: string | null
      avatarUrl?: string | null
      passwordHash?: string
    } = {}

    // 2. If email is being changed, ensure it's not taken by another user
    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      })
      if (existingEmail && existingEmail.id !== user.id) {
        return NextResponse.json(
          { error: 'Cette adresse email est déjà utilisée par un autre compte.' },
          { status: 400 }
        )
      }
      updateData.email = email.toLowerCase()
    }

    if (name) {
      updateData.name = name.trim()
    }

    if (phone !== undefined) {
      updateData.phone = phone ? phone.trim() : null
    }

    if (avatarUrl !== undefined) {
      updateData.avatarUrl = avatarUrl
    }

    // 3. If password change requested
    let passwordChanged = false
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Le mot de passe actuel est requis pour définir un nouveau mot de passe.' },
          { status: 400 }
        )
      }

      const isValidPassword = await verifyPassword(currentPassword, user.passwordHash)
      if (!isValidPassword) {
        await auditService.log({
          action: 'AUTH_FAILED',
          entityType: 'User',
          entityId: user.id,
          details: `Échec de vérification du mot de passe actuel pour ${user.email}`,
          userId: user.id,
        })
        return NextResponse.json(
          { error: 'Le mot de passe actuel est incorrect.' },
          { status: 400 }
        )
      }

      updateData.passwordHash = await hashPassword(newPassword)
      passwordChanged = true
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: 'Aucune modification transmise', user })
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    // Log the audit event
    await auditService.log({
      action: passwordChanged ? 'USER_UPDATED' : 'USER_UPDATED',
      entityType: 'User',
      entityId: user.id,
      details: passwordChanged
        ? `Modification du mot de passe et profil pour ${updatedUser.name} (${updatedUser.email})`
        : `Mise à jour des informations personnelles pour ${updatedUser.name} (${updatedUser.email})`,
      userId: user.id,
    })

    return NextResponse.json({
      success: true,
      message: passwordChanged
        ? 'Mot de passe et informations mis à jour avec succès.'
        : 'Informations personnelles mises à jour avec succès.',
      user: updatedUser,
    })
  } catch (error: unknown) {
    console.error('Erreur PATCH /api/profile:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
