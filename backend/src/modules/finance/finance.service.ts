import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../../entities/payment.entity';

@Injectable()
export class FinanceService {
  constructor(@InjectRepository(Payment) private readonly payments: Repository<Payment>) {}

  record(data: { studentId: string; amount: number; category?: string; paidAt?: string; reference?: string }) {
    const payment = this.payments.create({
      ...data,
      category: data.category ?? 'tuition',
      paidAt: data.paidAt ? new Date(data.paidAt) : new Date(),
    });
    return this.payments.save(payment);
  }

  list() {
    return this.payments.find({ order: { paidAt: 'DESC' } });
  }

  async dailySummary(date?: string) {
    const target = date ?? new Date().toISOString().slice(0, 10);
    const rows = await this.payments
      .createQueryBuilder('p')
      .select('p.category', 'category')
      .addSelect('SUM(p.amount)', 'total')
      .where(`DATE(p."paidAt") = :date`, { date: target })
      .groupBy('p.category')
      .getRawMany();
    return { date: target, totals: rows };
  }
}
