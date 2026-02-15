import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {
      role: 'ADMIN',
      isVerified: true,
    },
    create: {
      email: 'admin@gmail.com',
      password,
      fullName: 'Super Admin',
      phone: '0900000000',
      role: 'ADMIN',
      isVerified: true,
    },
  });

  console.log({ admin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
