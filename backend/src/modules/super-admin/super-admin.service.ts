import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../../entities/tenant.entity';
import { Subscription } from '../../entities/subscription.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class SuperAdminService {
  constructor(
    @InjectRepository(Tenant) private readonly tenants: Repository<Tenant>,
    @InjectRepository(Subscription) private readonly subs: Repository<Subscription>,
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async getDashboard() {
    const totalTenants = await this.tenants.count();
    const activeTenants = await this.tenants.count({ where: { active: true } });
    const totalUsers = await this.users.count();
    const totalRevenue = await this.subs
      .createQueryBuilder('s')
      .select('SUM(s.amount)', 'total')
      .where('s.status = :status', { status: 'active' })
      .getRawOne();

    const planBreakdown = await this.tenants
      .createQueryBuilder('t')
      .select('t.plan', 'plan')
      .addSelect('COUNT(*)', 'count')
      .groupBy('t.plan')
      .getRawMany();

    return {
      totalTenants,
      activeTenants,
      totalUsers,
      totalRevenue: Number(totalRevenue?.total ?? 0),
      planBreakdown,
    };
  }

  getRecentTenants() {
    return this.tenants.find({ order: { createdAt: 'DESC' }, take: 20 });
  }
}
