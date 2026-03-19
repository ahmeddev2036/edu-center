import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Redis } from 'ioredis';
import { AttendanceRecord } from '../../entities/attendance.entity';
import { Payment } from '../../entities/payment.entity';
import { Student } from '../../entities/student.entity';
import { ExamResult } from '../../entities/exam-result.entity';
import { redisOptions } from '../../infra/redis.config';

const CACHE_TTL = 300; // 5 دقائق

@Injectable()
export class ReportsService {
  private redis: Redis | null = null;

  constructor(
    @InjectRepository(AttendanceRecord) private readonly attendance: Repository<AttendanceRecord>,
    @InjectRepository(Payment) private readonly payments: Repository<Payment>,
    @InjectRepository(Student) private readonly students: Repository<Student>,
    @InjectRepository(ExamResult) private readonly results: Repository<ExamResult>,
  ) {
    try {
      this.redis = new Redis(redisOptions);
      this.redis.on('error', () => { this.redis = null; });
    } catch {
      this.redis = null;
    }
  }

  private async cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
    if (this.redis) {
      try {
        const hit = await this.redis.get(key);
        if (hit) return JSON.parse(hit) as T;
        const result = await fn();
        await this.redis.setex(key, CACHE_TTL, JSON.stringify(result));
        return result;
      } catch {
        // Redis unavailable, fallback to direct query
      }
    }
    return fn();
  }

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

  // 2.1 Analytics
  async getAnalytics() {
    return this.cached('analytics:dashboard', async () => {
      const totalStudents = await this.students.count();
      const today = new Date().toISOString().slice(0, 10);
      const todayAttendance = await this.attendanceDaily(today);

      const last7 = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().slice(0, 10);
        const r = await this.attendanceDaily(dateStr);
        last7.push(r);
      }

      const last6Months = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthStr = d.toISOString().slice(0, 7);
        const r = await this.financeMonthly(monthStr);
        const total = r.totals.reduce((sum: number, t: any) => sum + Number(t.total), 0);
        last6Months.push({ month: monthStr, total });
      }

      const avgResult = await this.results
        .createQueryBuilder('r')
        .select('AVG(r.score)', 'avg')
        .getRawOne();

      return {
        totalStudents,
        todayAttendance,
        attendanceLast7Days: last7,
        revenueLast6Months: last6Months,
        averageScore: Number(avgResult?.avg ?? 0).toFixed(1),
      };
    });
  }

  // 2.8 تقرير PDF (بيانات للـ frontend يولد PDF)
  async getFullReport(month?: string) {
    const target = month ?? new Date().toISOString().slice(0, 7);
    const finance = await this.financeMonthly(target);
    const totalRevenue = finance.totals.reduce((s: number, t: any) => s + Number(t.total), 0);
    const totalStudents = await this.students.count();
    const today = new Date().toISOString().slice(0, 10);
    const attendance = await this.attendanceDaily(today);

    return {
      month: target,
      totalStudents,
      totalRevenue,
      financeBreakdown: finance.totals,
      todayAttendance: attendance,
      generatedAt: new Date().toISOString(),
    };
  }
}
