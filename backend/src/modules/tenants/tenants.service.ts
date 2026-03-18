import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../../entities/tenant.entity';
import { Subscription } from '../../entities/subscription.entity';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant) private readonly tenants: Repository<Tenant>,
    @InjectRepository(Subscription) private readonly subs: Repository<Subscription>,
  ) {}

  findAll() { return this.tenants.find({ order: { createdAt: 'DESC' } }); }

  async findOne(id: string) {
    const t = await this.tenants.findOne({ where: { id } });
    if (!t) throw new NotFoundException('المستأجر غير موجود');
    return t;
  }

  findBySlug(slug: string) {
    return this.tenants.findOne({ where: { slug, active: true } });
  }

  async create(data: Partial<Tenant>) {
    const existing = await this.tenants.findOne({ where: { slug: data.slug } });
    if (existing) throw new ConflictException('هذا الـ slug مستخدم بالفعل');
    const trial = new Date();
    trial.setDate(trial.getDate() + 14); // 14 يوم تجريبي
    const t = this.tenants.create({ ...data, plan: 'trial', trialEndsAt: trial });
    return this.tenants.save(t);
  }

  async update(id: string, data: Partial<Tenant>) {
    await this.findOne(id);
    await this.tenants.update(id, data);
    return this.findOne(id);
  }

  async deactivate(id: string) {
    await this.tenants.update(id, { active: false });
    return { ok: true };
  }

  // إنشاء اشتراك
  async createSubscription(tenantId: string, plan: string, billingCycle: string) {
    const prices: Record<string, Record<string, number>> = {
      basic: { monthly: 99, yearly: 999 },
      pro: { monthly: 199, yearly: 1999 },
      enterprise: { monthly: 499, yearly: 4999 },
    };
    const amount = prices[plan]?.[billingCycle] ?? 99;
    const endsAt = new Date();
    if (billingCycle === 'yearly') endsAt.setFullYear(endsAt.getFullYear() + 1);
    else endsAt.setMonth(endsAt.getMonth() + 1);

    const sub = this.subs.create({ tenantId, plan, billingCycle, amount, status: 'active', startsAt: new Date(), endsAt });
    await this.subs.save(sub);
    await this.tenants.update(tenantId, { plan, subscriptionEndsAt: endsAt });
    return sub;
  }

  getSubscriptions(tenantId: string) {
    return this.subs.find({ where: { tenantId }, order: { createdAt: 'DESC' } });
  }
}
