import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../../entities/student.entity';
import { AttendanceRecord } from '../../entities/attendance.entity';
import { ExamResult } from '../../entities/exam-result.entity';
import { Payment } from '../../entities/payment.entity';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Student, AttendanceRecord, ExamResult, Payment])],
  providers: [AiService],
  controllers: [AiController],
  exports: [AiService],
})
export class AiModule {}
