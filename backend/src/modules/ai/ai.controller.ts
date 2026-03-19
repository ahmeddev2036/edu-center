import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscriptionGuard } from '../../common/subscription.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('ai')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, SubscriptionGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly svc: AiService) {}

  @Get('analyze/student/:id')
  analyzeStudent(@Param('id') id: string) {
    return this.svc.analyzeStudent(id);
  }

  @Post('generate/questions')
  generateQuestions(@Body() body: { subject: string; level: string; count: number }) {
    return this.svc.generateExamQuestions(body.subject, body.level, body.count || 5);
  }

  @Get('report/smart')
  smartReport() {
    return this.svc.generateSmartReport();
  }
}
