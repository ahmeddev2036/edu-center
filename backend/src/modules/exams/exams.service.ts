import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from '../../entities/exam.entity';
import { Question } from '../../entities/question.entity';
import { ExamResult } from '../../entities/exam-result.entity';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam) private readonly exams: Repository<Exam>,
    @InjectRepository(Question) private readonly questions: Repository<Question>,
    @InjectRepository(ExamResult) private readonly results: Repository<ExamResult>
  ) {}

  create(data: Partial<Exam>) {
    const exam = this.exams.create({
      ...data,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
    });
    return this.exams.save(exam);
  }

  async addQuestion(examId: string, data: Partial<Question>) {
    const exam = await this.exams.findOne({ where: { id: examId } });
    if (!exam) return { ok: false, message: 'Exam not found' };
    const q = this.questions.create({ ...data, exam });
    await this.questions.save(q);
    return { ok: true, question: q };
  }

  list() {
    return this.exams.find({ order: { createdAt: 'DESC' } });
  }

  getWithQuestions(id: string) {
    return this.exams.findOne({ where: { id }, relations: ['questions'] });
  }

  async submitResult(examId: string, studentId: string, score: number) {
    const exam = await this.exams.findOne({ where: { id: examId } });
    if (!exam) return { ok: false, message: 'Exam not found' };
    const grade = this.classify(score);
    const res = this.results.create({ exam, student: { id: studentId } as any, score, grade });
    await this.results.save(res);
    return { ok: true, result: res };
  }

  async getResults(examId: string) {
    return this.results.find({
      where: { exam: { id: examId } },
      relations: ['student', 'exam'],
    });
  }

  classify(score: number): string {
    if (score >= 90) return 'ممتاز';
    if (score >= 80) return 'جيد جداً';
    if (score >= 70) return 'جيد';
    if (score >= 60) return 'مقبول';
    return 'ضعيف';
  }
}
