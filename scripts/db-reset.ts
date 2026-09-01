import { execSync } from 'child_process'
import path from 'path'

const root = path.resolve(import.meta.dirname, '..')

function run(command: string) {
  console.log(`\n> ${command}`)
  execSync(command, { cwd: root, stdio: 'inherit' })
}

async function main() {
  console.log('=== DB Reset: drop → push schema → seed ===')

  // 1. Drop the existing database by pushing with --force-reset
  run('npx prisma db push --force-reset --skip-generate')

  // 2. Generate the Prisma client against the fresh schema
  run('npx prisma generate')

  // 3. Run the seed script
  run('npx tsx prisma/seed.ts')

  console.log('\n=== DB Reset complete ===')
}

main().catch((error) => {
  console.error('DB reset failed:', error)
  process.exit(1)
})
