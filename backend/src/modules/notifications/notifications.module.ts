import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationLog } from '../../entities/notification-log.entity';
import { Student } from '../../entities/student.entity';
import { Payment } from '../../entities/payment.entity';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { RemindersService } from './reminders.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationLog, Student, Payment])],
  controllers: [NotificationsController],
  providers: [NotificationsService, RemindersService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
