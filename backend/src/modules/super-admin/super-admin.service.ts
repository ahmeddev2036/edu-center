import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../../entities/tenant.entity';
import { NotificationLog } from '../../entities/notification-log.entity';

@Injectable()
export class SuperAdminService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
    @InjectRepository(NotificationLog)
    private readonly notifRepo: Repository<NotificationLog>,
  ) {}

  async getStats() {
    const total  = await this.tenantRepo.count();
    const active = await this.tenantRepo.count({ where: { active: true } });
    const trial  = await this.tenantRepo.count({ where: { plan: 'trial' } });
    const now    = new Date();
    const all    = await this.tenantRepo.find();
    const expired = all.filter(t =>
      (t.plan === 'trial' && t.trialEndsAt && now > t.trialEndsAt) ||
      (t.plan !== 'trial' && t.subscriptionEndsAt && now > t.subscriptionEndsAt),
    ).length;
    return { total, active, inactive: total - active, trial, expired };
  }

  async getTenants() {
    return this.tenantRepo.find({ order: { createdAt: 'DESC' } });
  }

  async extendSubscription(id: string, days: number) {
    const tenant = await this.tenantRepo.findOne({ where: { id } });
    if (!tenant) throw new NotFoundException('المستأجر غير موجود');
    const now  = new Date();
    const base = tenant.subscriptionEndsAt && tenant.subscriptionEndsAt > now
      ? tenant.subscriptionEndsAt : now;
    const newEnd = new Date(base);
    newEnd.setDate(newEnd.getDate() + days);
    tenant.subscriptionEndsAt = newEnd;
    if (tenant.plan === 'trial') tenant.plan = 'basic';
    tenant.active = true;
    await this.tenantRepo.save(tenant);
    return { success: true, subscriptionEndsAt: newEnd };
  }

  async toggleTenant(id: string, active: boolean) {
    const tenant = await this.tenantRepo.findOne({ where: { id } });
    if (!tenant) throw new NotFoundException('المستأجر غير موجود');
    tenant.active = active;
    await this.tenantRepo.save(tenant);
    return { success: true, active };
  }

  async changePlan(id: string, plan: string) {
    const tenant = await this.tenantRepo.findOne({ where: { id } });
    if (!tenant) throw new NotFoundException('المستأجر غير موجود');
    tenant.plan = plan;
    await this.tenantRepo.save(tenant);
    return { success: true, plan };
  }

  /**
   * إرسال إشعار broadcast لكل العملاء النشطين
   * يُسجَّل في notification_log ويُرسَل عبر webhook إن وُجد
   */
  async broadcastNotification(message: string, channel: 'email' | 'whatsapp' | 'sms') {
    const tenants = await this.tenantRepo.find({ where: { active: true } });
    const results: { tenant: string; recipient: string; status: string }[] = [];

    for (const tenant of tenants) {
      const recipient = tenant.ownerEmail || tenant.phone || '';
      if (!recipient) continue;

      // سجّل في قاعدة البيانات
      const log = this.notifRepo.create({
        channel,
        recipient,
        template: message,
        status: 'queued',
      });
      await this.notifRepo.save(log);

      // أرسل عبر webhook إن وُجد
      const webhookUrl = this.getWebhookUrl(channel);
      if (webhookUrl) {
        try {
          await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-API-KEY': process.env.NOTIFY_API_KEY || '',
            },
            body: JSON.stringify({ logId: log.id, channel, recipient, template: message }),
          });
          log.status = 'sent';
          await this.notifRepo.save(log);
          results.push({ tenant: tenant.name, recipient, status: 'sent' });
        } catch {
          log.status = 'failed';
          await this.notifRepo.save(log);
          results.push({ tenant: tenant.name, recipient, status: 'failed' });
        }
      } else {
        results.push({ tenant: tenant.name, recipient, status: 'queued' });
      }
    }

    return { sent: results.filter(r => r.status === 'sent').length, total: results.length, results };
  }

  async getNotificationHistory() {
    return this.notifRepo.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  private getWebhookUrl(channel: string): string | undefined {
    const map: Record<string, string | undefined> = {
      email:    process.env.EMAIL_WEBHOOK_URL,
      whatsapp: process.env.WHATSAPP_WEBHOOK_URL,
      sms:      process.env.SMS_WEBHOOK_URL,
    };
    return map[channel];
  }
}
