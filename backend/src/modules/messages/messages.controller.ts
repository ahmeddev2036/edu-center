import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(
    private readonly svc: MessagesService,
    private readonly gateway: MessagesGateway,
  ) {}

  @Get() findAll() { return this.svc.findAll(); }
  @Get('recipient/:id') forRecipient(@Param('id') id: string) { return this.svc.findForRecipient(id); }

  @Post()
  async create(@Body() dto: CreateMessageDto) {
    const message = await this.svc.create(dto);
    this.gateway.broadcastMessage(message);
    return message;
  }

  @Put(':id/read') markRead(@Param('id') id: string) { return this.svc.markRead(id); }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(id); }
}
