import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  @Roles('admin', 'teacher', 'staff')
  @Get('attendance/daily')
  dailyAttendance(@Query('date') date?: string) {
    return this.reports.attendanceDaily(date);
  }

  @Roles('admin', 'staff')
  @Get('finance/monthly')
  monthlyFinance(@Query('month') month?: string) {
    return this.reports.financeMonthly(month);
  }

  // 2.1 Analytics
  @Roles('admin', 'staff')
  @Get('analytics')
  analytics() {
    return this.reports.getAnalytics();
  }

  // 2.8 Full report for PDF
  @Roles('admin', 'staff')
  @Get('full')
  fullReport(@Query('month') month?: string) {
    return this.reports.getFullReport(month);
  }
}
