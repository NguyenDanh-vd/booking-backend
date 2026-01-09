import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect(); // Kết nối DB khi ứng dụng bật
  }

  async onModuleDestroy() {
    await this.$disconnect(); // Ngắt kết nối khi ứng dụng tắt
  }
}
