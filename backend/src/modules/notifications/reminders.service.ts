import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../../entities/student.entity';
import { Payment } from '../../entities/payment.entity';
import { NotificationsService } from './notifications.service';

@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);

  constructor(
    @InjectRepository(Student) private readonly students: Repository<Student>,
    @InjectRepository(Payment) private readonly payments: Repository<Payment>,
    private readonly notifications: NotificationsService,
  ) {}

  // كل يوم الساعة 9 صباحاً — تذكير بالحضور
  @Cron('0 9 * * *')
  async sendDailyAttendanceReminder() {
    this.logger.log('إرسال تذكير الحضور اليومي');
    const students = await this.students.find({ where: { guardianPhone: undefined } });
    // في الإنتاج: إرسال لكل ولي أمر له رقم
    this.logger.log(`تذكير الحضور: ${students.length} طالب`);
  }

  // أول كل شهر — تذكير بالرسوم
  @Cron('0 10 1 * *')
  async sendMonthlyFeeReminder() {
    this.logger.log('إرسال تذكير الرسوم الشهرية');
    const students = await this.students.find();
    for (const student of students) {
      if (student.guardianPhone) {
        await this.notifications.send(
          'whatsapp',
          student.guardianPhone,
          'fee_reminder',
          { studentName: student.fullName },
        ).catch(() => {});
      }
    }
    this.logger.log(`تذكير الرسوم: ${students.length} طالب`);
  }
}
