import prisma from '../src/lib/db'

async function main() {
  console.log('🔄 Configuring the 3 designated parks for MAALAL CARS...')

  // 1. Casablanca: Park Casablanca Secteur Car
  const casablancaPark = await prisma.park.upsert({
    where: { code: 'PRK-CAS-01' },
    update: {
      name: 'Park Casablanca Secteur Car',
      city: 'Casablanca',
      address: 'Boulevard Sidi Maârouf, Secteur Car, Casablanca',
      phone: '+212 5 22 78 45 10',
      managerName: 'Adem Maalal',
      capacity: 50,
      isActive: true,
    },
    create: {
      code: 'PRK-CAS-01',
      name: 'Park Casablanca Secteur Car',
      city: 'Casablanca',
      address: 'Boulevard Sidi Maârouf, Secteur Car, Casablanca',
      phone: '+212 5 22 78 45 10',
      managerName: 'Adem Maalal',
      capacity: 50,
      isActive: true,
    },
  })
  console.log('✅ Park 1 (Casablanca) configured:', casablancaPark.name)

  // 2. Fès: Park Fes Maalal Cars Atlas
  const fesAtlasPark = await prisma.park.upsert({
    where: { code: 'PRK-FES-01' },
    update: {
      name: 'Park Fes Maalal Cars Atlas',
      city: 'Fès',
      address: 'Boulevard Allal Ben Abdellah, Quartier Atlas, Fès',
      phone: '+212 5 35 62 78 90',
      managerName: 'Tariq Alami',
      capacity: 35,
      isActive: true,
    },
    create: {
      code: 'PRK-FES-01',
      name: 'Park Fes Maalal Cars Atlas',
      city: 'Fès',
      address: 'Boulevard Allal Ben Abdellah, Quartier Atlas, Fès',
      phone: '+212 5 35 62 78 90',
      managerName: 'Tariq Alami',
      capacity: 35,
      isActive: true,
    },
  })
  console.log('✅ Park 2 (Fès Atlas) configured:', fesAtlasPark.name)

  // 3. Fès: Park Fes Maalal Cars Ennargiss
  const fesEnnargissPark = await prisma.park.upsert({
    where: { code: 'PRK-FES-02' },
    update: {
      name: 'Park Fes Maalal Cars Ennargiss',
      city: 'Fès',
      address: 'Avenue des Forces Armées Royales, Quartier Ennargiss, Fès',
      phone: '+212 5 35 73 15 20',
      managerName: 'Hamza Maalal',
      capacity: 40,
      isActive: true,
    },
    create: {
      code: 'PRK-FES-02',
      name: 'Park Fes Maalal Cars Ennargiss',
      city: 'Fès',
      address: 'Avenue des Forces Armées Royales, Quartier Ennargiss, Fès',
      phone: '+212 5 35 73 15 20',
      managerName: 'Hamza Maalal',
      capacity: 40,
      isActive: true,
    },
  })
  console.log('✅ Park 3 (Fès Ennargiss) configured:', fesEnnargissPark.name)

  // Update vehicle locations referencing old park names
  await prisma.vehicle.updateMany({
    where: { parkId: casablancaPark.id },
    data: { location: casablancaPark.name },
  })

  await prisma.vehicle.updateMany({
    where: { parkId: fesAtlasPark.id },
    data: { location: fesAtlasPark.name },
  })

  // Also ensure any leftover parks with other codes are deactivated or cleaned if any
  const allParks = await prisma.park.findMany({
    where: { code: { notIn: ['PRK-CAS-01', 'PRK-FES-01', 'PRK-FES-02'] } },
  })
  for (const p of allParks) {
    await prisma.park.update({
      where: { id: p.id },
      data: { isActive: false },
    })
  }

  const finalParks = await prisma.park.findMany({ where: { isActive: true } })
  console.log('\n🏛️ Current Active Parks in MAALAL CARS:')
  for (const p of finalParks) {
    console.log(`- [${p.code}] ${p.name} (${p.city}) — Adresse: ${p.address}`)
  }
}

main()
  .catch((e) => {
    console.error('Error updating parks:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
