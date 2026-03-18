import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceModule } from './attendance/attendance.module';
import { AuthModule } from './auth/auth.module';
import { ExamsModule } from './exams/exams.module';
import { FinanceModule } from './finance/finance.module';
import { MediaModule } from './media/media.module';
import { NotificationsModule } from './notifications/notifications.module';
import { StaffModule } from './staff/staff.module';
import { StudentsModule } from './students/students.module';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { CertificatesModule } from './certificates/certificates.module';
import { User } from '../entities/user.entity';
import { Student } from '../entities/student.entity';
import { AttendanceRecord } from '../entities/attendance.entity';
import { Payment } from '../entities/payment.entity';
import { Staff } from '../entities/staff.entity';
import { Video } from '../entities/video.entity';
import { Exam } from '../entities/exam.entity';
import { Question } from '../entities/question.entity';
import { ExamResult } from '../entities/exam-result.entity';
import { NotificationLog } from '../entities/notification-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Student,
      AttendanceRecord,
      Payment,
      Staff,
      Video,
      Exam,
      Question,
      ExamResult,
      NotificationLog
    ]),
    UsersModule,
    AuthModule,
    StudentsModule,
    AttendanceModule,
    ExamsModule,
    FinanceModule,
    StaffModule,
    MediaModule,
    NotificationsModule,
    ReportsModule,
    CertificatesModule
  ]
})
export class DomainModule {}
