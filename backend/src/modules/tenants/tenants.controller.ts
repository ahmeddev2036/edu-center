import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('tenants')
@Controller('tenants')
export class TenantsController {
  constructor(private readonly svc: TenantsService) {}

  // Super Admin endpoints
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() { return this.svc.findAll(); }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  // Public: onboarding
  @Public()
  @Post()
  create(@Body() data: any) { return this.svc.create(data); }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) { return this.svc.update(id, data); }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deactivate(@Param('id') id: string) { return this.svc.deactivate(id); }

  // Public: resolve tenant by slug
  @Public()
  @Get('resolve/:slug')
  resolve(@Param('slug') slug: string) { return this.svc.findBySlug(slug); }

  // Subscriptions
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/subscribe')
  subscribe(@Param('id') id: string, @Body() body: { plan: string; billingCycle: string }) {
    return this.svc.createSubscription(id, body.plan, body.billingCycle);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id/subscriptions')
  subscriptions(@Param('id') id: string) { return this.svc.getSubscriptions(id); }

  // Stripe Webhook (public)
  @Public()
  @Post('stripe/webhook')
  async stripeWebhook(@Body() body: any) {
    if (body?.type === 'payment_intent.succeeded') {
      await this.svc.confirmPayment(body.data?.object?.id);
    }
    return { received: true };
  }
}
