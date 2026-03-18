import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { FinanceService } from './finance.service';
import { RecordPaymentDto } from './dto/record-payment.dto';

@ApiTags('Finance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('finance')
export class FinanceController {
  constructor(private readonly finance: FinanceService) {}

  @Roles('admin', 'staff')
  @Post('payments')
  record(@Body() body: RecordPaymentDto) {
    return this.finance.record(body);
  }

  @Roles('admin', 'staff')
  @Get('payments')
  list() {
    return this.finance.list();
  }

  @Roles('admin', 'staff')
  @Get('summary/daily')
  dailySummary(@Query('date') date?: string) {
    return this.finance.dailySummary(date);
  }
}
