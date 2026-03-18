import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceRecord } from '../../entities/attendance.entity';
import { Payment } from '../../entities/payment.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(AttendanceRecord) private readonly attendance: Repository<AttendanceRecord>,
    @InjectRepository(Payment) private readonly payments: Repository<Payment>
  ) {}

  async attendanceDaily(date?: string) {
    const target = date ?? new Date().toISOString().slice(0, 10);
    const rows = await this.attendance
      .createQueryBuilder('a')
      .select('a.present', 'present')
      .addSelect('COUNT(*)', 'count')
      .where('a."sessionDate" = :date', { date: target })
      .groupBy('a.present')
      .getRawMany();

    const present = rows.find((r: any) => r.present === true)?.count ?? 0;
    const absent = rows.find((r: any) => r.present === false)?.count ?? 0;
    return { date: target, present: Number(present), absent: Number(absent) };
  }

  async financeMonthly(month?: string) {
    const target = month ?? new Date().toISOString().slice(0, 7);
    const rows = await this.payments
      .createQueryBuilder('p')
      .select('p.category', 'category')
      .addSelect('SUM(p.amount)', 'total')
      .where(`TO_CHAR(p."paidAt", 'YYYY-MM') = :month`, { month: target })
      .groupBy('p.category')
      .getRawMany();
    return { month: target, totals: rows };
  }
}
