import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceRecord } from '../../entities/attendance.entity';
import { Student } from '../../entities/student.entity';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';

@Module({
  imports: [TypeOrmModule.forFeature([AttendanceRecord, Student])],
  controllers: [AttendanceController],
  providers: [AttendanceService]
})
export class AttendanceModule {}
