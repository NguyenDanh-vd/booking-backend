import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
<<<<<<< HEAD
=======
import { NotificationsGateway } from './notifications.gateway';
>>>>>>> upstream/main
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationsController],
<<<<<<< HEAD
  providers: [NotificationsService],
=======
  providers: [NotificationsService, NotificationsGateway],
>>>>>>> upstream/main
  exports: [NotificationsService], 
})
export class NotificationsModule {}