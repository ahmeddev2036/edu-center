import {
  Controller, Get, Patch, Post, Param, Body,
  UseGuards, ForbiddenException,
} from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

const OWNER_EMAIL = 'ATEXPLAINERSTUDIO@GMAIL.COM';

function ownerOnly(user: any) {
  if (!user || user.email?.toUpperCase() !== OWNER_EMAIL) {
    throw new ForbiddenException('هذه اللوحة للمالك فقط.');
  }
}

@ApiTags('super-admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('super-admin')
export class SuperAdminController {
  constructor(private readonly svc: SuperAdminService) {}

  @Get('stats')
  getStats(@CurrentUser() user: any) {
    ownerOnly(user);
    return this.svc.getStats();
  }

  @Get('tenants')
  getTenants(@CurrentUser() user: any) {
    ownerOnly(user);
    return this.svc.getTenants();
  }

  @Patch('tenants/:id/extend')
  extendSubscription(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() body: { days: number },
  ) {
    ownerOnly(user);
    return this.svc.extendSubscription(id, body.days);
  }

  @Patch('tenants/:id/toggle')
  toggleTenant(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() body: { active: boolean },
  ) {
    ownerOnly(user);
    return this.svc.toggleTenant(id, body.active);
  }

  @Patch('tenants/:id/plan')
  changePlan(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() body: { plan: string },
  ) {
    ownerOnly(user);
    return this.svc.changePlan(id, body.plan);
  }

  /** إرسال إشعار لكل العملاء */
  @Post('broadcast')
  broadcast(
    @CurrentUser() user: any,
    @Body() body: { message: string; channel: 'email' | 'whatsapp' | 'sms' },
  ) {
    ownerOnly(user);
    return this.svc.broadcastNotification(body.message, body.channel);
  }

  /** سجل الإشعارات */
  @Get('notifications')
  getNotifications(@CurrentUser() user: any) {
    ownerOnly(user);
    return this.svc.getNotificationHistory();
  }
}
