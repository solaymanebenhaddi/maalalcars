import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { auditService } from '@/services/audit.service'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const createUserSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  phone: z.string().nullable().optional(),
  roleId: z.string().min(1, 'Le rôle est requis'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  isActive: z.boolean().default(true),
})

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const users = await prisma.user.findMany({
      where: { archivedAt: null },
      include: {
        role: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    const roles = await prisma.role.findMany({
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        avatarUrl: u.avatarUrl,
        isActive: u.isActive,
        role: u.role.name,
        roleId: u.roleId,
        createdAt: u.createdAt,
      })),
      roles,
    })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    if (session.role.name !== 'Super Admin') {
      return NextResponse.json({ error: 'Seul le Super Admin peut créer un utilisateur' }, { status: 403 })
    }

    const body = await request.json()
    const parsed = createUserSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Données invalides' },
        { status: 400 }
      )
    }

    const { name, email, phone, roleId, password, isActive } = parsed.data

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cette adresse email existe déjà.' },
        { status: 400 }
      )
    }

    const passwordHash = await hashPassword(password)

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone ? phone.trim() : null,
        roleId,
        passwordHash,
        isActive,
      },
      include: { role: true },
    })

    await auditService.log({
      action: 'USER_CREATED',
      entityType: 'User',
      entityId: newUser.id,
      details: `Création du compte utilisateur ${newUser.name} (${newUser.email}) - Rôle: ${newUser.role.name}`,
      userId: session.id,
    })

    return NextResponse.json({
      success: true,
      message: 'Utilisateur créé avec succès.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role.name,
        isActive: newUser.isActive,
      },
    })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    )
  }
}
