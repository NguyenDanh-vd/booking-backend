import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 1. Tạo mật khẩu đã mã hóa
  const password = await bcrypt.hash('admin123', 10);

  // 2. Tạo hoặc update Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {}, // Nếu tồn tại rồi thì không làm gì
    create: {
      email: 'admin@gmail.com',
      password: password,
      fullName: 'Super Admin',
      phone: '0900000000',
      role: 'ADMIN', // 👈 Quan trọng nhất chỗ này
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