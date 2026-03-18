import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Student } from '../entities/student.entity';
import { Staff } from '../entities/staff.entity';
import { AttendanceRecord } from '../entities/attendance.entity';
import { Payment } from '../entities/payment.entity';
import { Exam } from '../entities/exam.entity';
import { Question } from '../entities/question.entity';
import { ExamResult } from '../entities/exam-result.entity';
import { Video } from '../entities/video.entity';
import { NotificationLog } from '../entities/notification-log.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.POSTGRES_URL || 'postgres://postgres:postgres@localhost:5432/edu_center',
  entities: [User, Student, Staff, AttendanceRecord, Payment, Exam, Question, ExamResult, Video, NotificationLog],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
