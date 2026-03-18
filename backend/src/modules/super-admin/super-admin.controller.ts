import { Controller, Get, UseGuards } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('super-admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('super-admin')
export class SuperAdminController {
  constructor(private readonly svc: SuperAdminService) {}

  @Get('dashboard')
  dashboard() { return this.svc.getDashboard(); }

  @Get('tenants')
  tenants() { return this.svc.getRecentTenants(); }
}
