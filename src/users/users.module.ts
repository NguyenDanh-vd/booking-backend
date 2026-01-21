import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

import { BookingsModule } from '../bookings/bookings.module';
import { PropertiesModule } from '../properties/properties.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    PrismaModule,
    BookingsModule,   // 👈 chứa BookingsService
    PropertiesModule, // 👈 chứa PropertiesService
    CloudinaryModule, // 👈 chứa CloudinaryService
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
