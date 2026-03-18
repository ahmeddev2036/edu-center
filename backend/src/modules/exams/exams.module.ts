import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from '../../entities/exam.entity';
import { Question } from '../../entities/question.entity';
import { ExamResult } from '../../entities/exam-result.entity';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';

@Module({
  imports: [TypeOrmModule.forFeature([Exam, Question, ExamResult])],
  controllers: [ExamsController],
  providers: [ExamsService]
})
export class ExamsModule {}
