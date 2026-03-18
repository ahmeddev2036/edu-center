import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('ai')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly svc: AiService) {}

  // 4.1 تحليل أداء طالب
  @Get('analyze/student/:id')
  analyzeStudent(@Param('id') id: string) {
    return this.svc.analyzeStudent(id);
  }

  // 4.2 توليد أسئلة امتحان
  @Post('generate/questions')
  generateQuestions(@Body() body: { subject: string; level: string; count: number }) {
    return this.svc.generateExamQuestions(body.subject, body.level, body.count || 5);
  }

  // 4.3 تقرير ذكي
  @Get('report/smart')
  smartReport() {
    return this.svc.generateSmartReport();
  }
}
