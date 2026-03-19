import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../../entities/student.entity';
import { AttendanceRecord } from '../../entities/attendance.entity';
import { ExamResult } from '../../entities/exam-result.entity';
import { Payment } from '../../entities/payment.entity';
import { Tenant } from '../../entities/tenant.entity';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { SubscriptionGuard } from '../../common/subscription.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Student, AttendanceRecord, ExamResult, Payment, Tenant])],
  providers: [AiService, SubscriptionGuard],
  controllers: [AiController],
  exports: [AiService],
})
export class AiModule {}
