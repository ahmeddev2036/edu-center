import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ExamsService } from './exams.service';
import { AddQuestionDto, CreateExamDto, SubmitResultDto } from './dto/create-exam.dto';

@ApiTags('Exams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('exams')
export class ExamsController {
  constructor(private readonly exams: ExamsService) {}

  @Roles('admin', 'teacher')
  @Post()
  create(@Body() body: CreateExamDto) {
    return this.exams.create({
      ...body,
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : undefined,
    });
  }

  @Roles('admin', 'teacher', 'staff')
  @Get()
  list() {
    return this.exams.list();
  }

  @Roles('admin', 'teacher', 'staff')
  @Get(':id')
  get(@Param('id') id: string) {
    return this.exams.getWithQuestions(id);
  }

  @Roles('admin', 'teacher')
  @Post(':id/questions')
  addQuestion(@Param('id') id: string, @Body() body: AddQuestionDto) {
    return this.exams.addQuestion(id, body);
  }

  @Roles('admin', 'teacher')
  @Post(':id/results')
  submitResult(@Param('id') id: string, @Body() body: SubmitResultDto) {
    return this.exams.submitResult(id, body.studentId, body.score);
  }

  @Roles('admin', 'teacher', 'staff')
  @Get(':id/results')
  getResults(@Param('id') id: string) {
    return this.exams.getResults(id);
  }
}
