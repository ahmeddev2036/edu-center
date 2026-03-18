import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AttendanceService } from './attendance.service';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendance: AttendanceService) {}

  @Roles('admin', 'teacher', 'staff')
  @Post()
  mark(@Body() body: MarkAttendanceDto) {
    return this.attendance.mark(body);
  }

  @Roles('admin', 'teacher', 'staff')
  @Get('student/:studentId')
  listForStudent(@Param('studentId') studentId: string) {
    return this.attendance.listForStudent(studentId);
  }

  @Roles('admin', 'teacher', 'staff')
  @Get('session/:date')
  listForSession(@Param('date') date: string) {
    return this.attendance.listForSession(date);
  }

  // QR Code scan — public endpoint (no auth needed for kiosk)
  @Public()
  @Post('qr-scan')
  qrScan(@Body() body: { code: string; sessionDate?: string }) {
    return this.attendance.markByQr(body.code, body.sessionDate);
  }
}
