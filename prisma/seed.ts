import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Tạo mật khẩu đã mã hóa
  const password = await bcrypt.hash('admin123', 10);

  // Tạo hoặc update Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {}, // Không cập nhật gì nếu đã tồn tại
    create: {
      email: 'admin@gmail.com',
      password: password,
      fullName: 'Super Admin',
      phone: '0900000000',
      role: 'ADMIN', // Vai trò ADMIN
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