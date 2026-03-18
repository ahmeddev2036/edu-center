import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceRecord } from '../../entities/attendance.entity';
import { Payment } from '../../entities/payment.entity';
import { Student } from '../../entities/student.entity';
import { ExamResult } from '../../entities/exam-result.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceRecord, Payment, Student, ExamResult])],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
