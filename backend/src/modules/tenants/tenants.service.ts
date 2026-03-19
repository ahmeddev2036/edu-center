import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Tenant } from '../../entities/tenant.entity';
import { Subscription } from '../../entities/subscription.entity';

@Injectable()
export class TenantsService {
  private stripe: Stripe | null = null;
  private readonly logger = new Logger(TenantsService.name);

  constructor(
    @InjectRepository(Tenant) private readonly tenants: Repository<Tenant>,
    @InjectRepository(Subscription) private readonly subs: Repository<Subscription>,
  ) {
    if (process.env.STRIPE_SECRET_KEY) {
      this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-02-25.clover' });
    }
  }

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

  // إنشاء اشتراك مع Stripe إذا كان متاحاً
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

    let paymentIntentId: string | undefined;

    // محاولة إنشاء PaymentIntent عبر Stripe
    if (this.stripe) {
      try {
        const intent = await this.stripe.paymentIntents.create({
          amount: amount * 100, // Stripe بيستخدم أصغر وحدة عملة
          currency: 'egp',
          metadata: { tenantId, plan, billingCycle },
        });
        paymentIntentId = intent.id;
        this.logger.log(`Stripe PaymentIntent created: ${intent.id}`);
      } catch (err) {
        this.logger.warn('Stripe not available, proceeding without payment:', err);
      }
    }

    const sub = this.subs.create({
      tenantId,
      plan,
      billingCycle,
      amount,
      status: paymentIntentId ? 'pending_payment' : 'active',
      startsAt: new Date(),
      endsAt,
      ...(paymentIntentId && { reference: paymentIntentId }),
    });
    await this.subs.save(sub);
    await this.tenants.update(tenantId, { plan, subscriptionEndsAt: endsAt });
    return { ...sub, paymentIntentId };
  }

  // Stripe Webhook: تأكيد الدفع
  async confirmPayment(paymentIntentId: string) {
    const sub = await this.subs.findOne({ where: { reference: paymentIntentId } });
    if (sub) {
      await this.subs.update(sub.id, { status: 'active' });
      this.logger.log(`Subscription ${sub.id} activated via Stripe webhook`);
    }
    return { ok: true };
  }

  getSubscriptions(tenantId: string) {
    return this.subs.find({ where: { tenantId }, order: { createdAt: 'DESC' } });
  }
}
