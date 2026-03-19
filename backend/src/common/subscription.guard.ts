import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user?.tenantId) {
      throw new ForbiddenException({
        code: 'NO_TENANT',
        message: 'لا يوجد حساب مرتبط بهذا المستخدم.',
      });
    }

    const tenant = await this.tenantRepo.findOne({ where: { id: user.tenantId } });

    if (!tenant || !tenant.active) {
      throw new ForbiddenException({
        code: 'TENANT_INACTIVE',
        message: 'الحساب غير نشط. تواصل مع الدعم.',
      });
    }

    const now = new Date();

    // Check trial period
    if (tenant.plan === 'trial' && tenant.trialEndsAt) {
      if (now > tenant.trialEndsAt) {
        throw new ForbiddenException({
          code: 'TRIAL_EXPIRED',
          message: 'انتهت الفترة التجريبية. للاستمرار في استخدام الذكاء الاصطناعي، تواصل مع المالك عبر واتساب: 01113955198',
          whatsapp: 'https://wa.me/201113955198',
        });
      }
    }

    // Check paid subscription
    if (tenant.plan !== 'trial' && tenant.subscriptionEndsAt) {
      if (now > tenant.subscriptionEndsAt) {
        throw new ForbiddenException({
          code: 'SUBSCRIPTION_EXPIRED',
          message: 'انتهى اشتراكك. للتجديد تواصل مع المالك عبر واتساب: 01113955198',
          whatsapp: 'https://wa.me/201113955198',
        });
      }
    }

    return true;
  }
}
