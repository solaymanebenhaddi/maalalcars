import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create default roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Administrator with full access',
    },
  })

  const managerRole = await prisma.role.upsert({
    where: { name: 'manager' },
    update: {},
    create: {
      name: 'manager',
      description: 'Manager with elevated access',
    },
  })

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      description: 'Standard user with basic access',
    },
  })

  console.log('Roles created:', adminRole.name, managerRole.name, userRole.name)

  // Create default admin user
  const passwordHash = await bcrypt.hash('changeme', 12)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@maalal.ma' },
    update: {},
    create: {
      email: 'admin@maalal.ma',
      name: 'Admin MAALAL',
      passwordHash,
      roleId: adminRole.id,
      isActive: true,
    },
  })

  console.log('Admin user created:', adminUser.email)

  // Create default application settings
  const settings = [
    {
      key: 'app_name',
      value: 'MAALAL CARS',
      description: 'Application display name',
    },
    {
      key: 'locale',
      value: 'fr-MA',
      description: 'Default application locale',
    },
    {
      key: 'currency',
      value: 'MAD',
      description: 'Default currency code',
    },
    {
      key: 'currency_display',
      value: 'DH',
      description: 'Default currency display symbol',
    },
  ]

  for (const setting of settings) {
    await prisma.applicationSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, description: setting.description },
      create: setting,
    })
  }

  console.log('Application settings created:', settings.map((s) => s.key).join(', '))
  console.log('Seeding complete.')
}

main()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
