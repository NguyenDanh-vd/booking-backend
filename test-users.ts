import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ 
    select: { id: true, email: true, fullName: true, role: true } 
  });
  console.log('All Users:');
  console.log(JSON.stringify(users, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
