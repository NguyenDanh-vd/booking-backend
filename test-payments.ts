import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking database...');
  
  const payments = await prisma.payment.findMany({
    include: {
      booking: {
        include: {
          property: { select: { title: true, address: true } },
        },
      },
    },
  });
  
  console.log('Total payments:', payments.length);
  console.log('Payments:', JSON.stringify(payments, null, 2));
  
  const bookings = await prisma.booking.findMany();
  console.log('Total bookings:', bookings.length);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
