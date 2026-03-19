import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AiService } from './ai.service';
import { Student } from '../../entities/student.entity';
import { AttendanceRecord } from '../../entities/attendance.entity';
import { ExamResult } from '../../entities/exam-result.entity';
import { Payment } from '../../entities/payment.entity';

const mockRepo = () => ({
  findOne: jest.fn(),
  find: jest.fn(),
  count: jest.fn(),
  createQueryBuilder: jest.fn(),
});

describe('AiService', () => {
  let service: AiService;
  const studentRepo = mockRepo();
  const attendanceRepo = mockRepo();
  const resultsRepo = mockRepo();
  const paymentsRepo = mockRepo();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        { provide: getRepositoryToken(Student), useValue: studentRepo },
        { provide: getRepositoryToken(AttendanceRecord), useValue: attendanceRepo },
        { provide: getRepositoryToken(ExamResult), useValue: resultsRepo },
        { provide: getRepositoryToken(Payment), useValue: paymentsRepo },
      ],
    }).compile();
    service = module.get<AiService>(AiService);
    jest.clearAllMocks();
  });

  it('returns not found when student does not exist', async () => {
    studentRepo.findOne.mockResolvedValue(null);
    const res = await service.analyzeStudent('nonexistent');
    expect((res as any).ok).toBe(false);
  });

  it('analyzes student with low attendance', async () => {
    studentRepo.findOne.mockResolvedValue({ id: 's1', fullName: 'أحمد' });
    attendanceRepo.find.mockResolvedValue([
      { present: false }, { present: false }, { present: true },
    ]);
    resultsRepo.find.mockResolvedValue([{ score: 80 }]);
    const res = await service.analyzeStudent('s1') as any;
    // 1/3 = 33% attendance → high risk
    expect(res.analysis.riskLevel).toBe('high');
  });

  it('generates exam questions from templates', async () => {
    const res = await service.generateExamQuestions('رياضيات', 'متوسط', 3) as any;
    expect(res.questions.length).toBeGreaterThan(0);
    expect(res.subject).toBe('رياضيات');
  });

  it('generates smart report', async () => {
    studentRepo.count.mockResolvedValue(10);
    attendanceRepo.find.mockResolvedValue([{ present: true }, { present: false }]);
    resultsRepo.find.mockResolvedValue([{ score: 75 }]);
    paymentsRepo.find.mockResolvedValue([{ amount: 500 }]);
    const res = await service.generateSmartReport() as any;
    expect(res.summary.totalStudents).toBe(10);
  });
});
