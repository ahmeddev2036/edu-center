import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { NotificationsService } from './notifications.service';
import { SendNotificationDto } from './dto/send-notification.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Roles('admin', 'staff')
  @Post('whatsapp')
  sendWhatsapp(@Body() body: SendNotificationDto) {
    return this.notifications.send('whatsapp', body.recipient, body.template, body.payload);
  }

  @Roles('admin', 'staff')
  @Post('email')
  sendEmail(@Body() body: SendNotificationDto) {
    return this.notifications.send('email', body.recipient, body.template, body.payload);
  }

  @Roles('admin', 'staff')
  @Post('sms')
  sendSms(@Body() body: SendNotificationDto) {
    return this.notifications.send('sms', body.recipient, body.template, body.payload);
  }

  @Roles('admin')
  @Get('logs')
  getLogs() {
    return this.notifications.getLogs();
  }
}
