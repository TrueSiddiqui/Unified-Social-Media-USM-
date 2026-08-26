import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Seed the hidden test account
  const hashedPassword = await bcrypt.hash('8$FLVnGz7c', 12)
  await prisma.user.upsert({
    where: { email: 'abacus-19a69253@example.com' },
    update: {
      hashedPassword,
      name: 'Test User',
    },
    create: {
      email: 'abacus-19a69253@example.com',
      name: 'Test User',
      hashedPassword,
    },
  })

  console.log('Seed completed successfully')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
