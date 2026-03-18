import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExamsService } from './exams.service';
import { Exam } from '../../entities/exam.entity';
import { Question } from '../../entities/question.entity';
import { ExamResult } from '../../entities/exam-result.entity';

const mockRepo = () => ({ create: jest.fn(), save: jest.fn(), findOne: jest.fn(), find: jest.fn() });

describe('ExamsService', () => {
  let service: ExamsService;
  const examRepo = mockRepo();
  const questionRepo = mockRepo();
  const resultRepo = mockRepo();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamsService,
        { provide: getRepositoryToken(Exam), useValue: examRepo },
        { provide: getRepositoryToken(Question), useValue: questionRepo },
        { provide: getRepositoryToken(ExamResult), useValue: resultRepo },
      ],
    }).compile();
    service = module.get<ExamsService>(ExamsService);
    jest.clearAllMocks();
  });

  it('classifies score correctly', () => {
    expect(service.classify(92)).toBe('ممتاز');
    expect(service.classify(82)).toBe('جيد جداً');
    expect(service.classify(72)).toBe('جيد');
    expect(service.classify(62)).toBe('مقبول');
    expect(service.classify(40)).toBe('ضعيف');
  });

  it('classifies boundary scores', () => {
    expect(service.classify(90)).toBe('ممتاز');
    expect(service.classify(80)).toBe('جيد جداً');
    expect(service.classify(70)).toBe('جيد');
    expect(service.classify(60)).toBe('مقبول');
    expect(service.classify(59)).toBe('ضعيف');
  });

  it('returns not found when exam missing', async () => {
    examRepo.findOne.mockResolvedValue(null);
    const res = await service.addQuestion('x', { text: 'سؤال' });
    expect((res as any).ok).toBe(false);
  });

  it('adds question to existing exam', async () => {
    examRepo.findOne.mockResolvedValue({ id: 'e1' });
    questionRepo.create.mockReturnValue({ id: 'q1' });
    questionRepo.save.mockResolvedValue({ id: 'q1' });
    const res = await service.addQuestion('e1', { text: 'سؤال' });
    expect((res as any).ok).toBe(true);
  });
});
