import { PrismaClient } from '@prisma/client'

async function main() {
  const prisma = new PrismaClient()
  try {
    const users = await prisma.user.findMany()
    console.log('Successfully connected. Users count:', users.length)
  } catch (e) {
    console.error('Error connecting:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
