import { userRepository } from '@/repositories/user.repository'
import { verifyPassword, hashPassword, createSession, validateSession, invalidateSession, RequestHeaders } from '@/lib/auth'
import { auditService } from './audit.service'
import { LoginInput, UserCreateInput } from '@/validation/auth.schema'

export const authService = {
  async login(input: LoginInput, headers: RequestHeaders) {
    const user = await userRepository.getByEmail(input.email)
    if (!user) {
      throw new Error('Identifiants invalides')
    }

    if (!user.isActive) {
      throw new Error('Ce compte utilisateur a été désactivé')
    }

    const isValid = await verifyPassword(input.password, user.passwordHash)
    if (!isValid) {
      await auditService.log({
        action: 'AUTH_FAILED',
        entityType: 'User',
        entityId: user.id,
        details: `Tentative de connexion échouée pour ${input.email}`,
      })
      throw new Error('Identifiants invalides')
    }

    const session = await createSession(user.id, headers)

    await auditService.log({
      action: 'AUTH_LOGIN',
      entityType: 'User',
      entityId: user.id,
      details: `Connexion réussie de ${user.name}`,
      userId: user.id,
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.name,
        permissions: user.role.permissions.map((p) => `${p.action}:${p.subject}`),
      },
      token: session.token,
      expiresAt: session.expiresAt,
    }
  },

  async validateToken(token: string) {
    return validateSession(token)
  },

  async logout(token: string, userId?: string) {
    await invalidateSession(token)
    if (userId) {
      await auditService.log({
        action: 'AUTH_LOGOUT',
        entityType: 'User',
        entityId: userId,
        details: 'Déconnexion utilisateur',
        userId,
      })
    }
  },

  async registerUser(input: UserCreateInput, creatorUserId?: string) {
    const existing = await userRepository.getByEmail(input.email)
    if (existing) {
      throw new Error('Un utilisateur avec cet email existe déjà')
    }

    const passwordHash = await hashPassword(input.password)

    const user = await userRepository.create({
      email: input.email,
      name: input.name,
      phone: input.phone || null,
      passwordHash,
      role: { connect: { id: input.roleId } },
      isActive: input.isActive,
    })

    await auditService.log({
      action: 'USER_CREATED',
      entityType: 'User',
      entityId: user.id,
      details: `Création du compte utilisateur ${user.name} (${user.email})`,
      userId: creatorUserId,
    })

    return user
  },
}
