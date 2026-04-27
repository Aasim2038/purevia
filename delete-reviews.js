const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.review.deleteMany();
  console.log('Deleted all reviews');
}
main()
  .catch(e => console.error(e))
  .finally(async () => { await prisma.$disconnect() });
