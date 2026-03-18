import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FinanceService } from './finance.service';
import { Payment } from '../../entities/payment.entity';

const mockRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  createQueryBuilder: jest.fn(),
});

describe('FinanceService', () => {
  let service: FinanceService;
  const repo = mockRepo();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinanceService,
        { provide: getRepositoryToken(Payment), useValue: repo },
      ],
    }).compile();
    service = module.get<FinanceService>(FinanceService);
    jest.clearAllMocks();
  });

  it('records a payment with default category', async () => {
    repo.create.mockReturnValue({ id: 'p1', category: 'tuition' });
    repo.save.mockResolvedValue({ id: 'p1', category: 'tuition' });
    const res = await service.record({ studentId: 's1', amount: 500 });
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({ category: 'tuition' })
    );
  });

  it('records a payment with custom category', async () => {
    repo.create.mockReturnValue({ id: 'p2', category: 'exam' });
    repo.save.mockResolvedValue({ id: 'p2', category: 'exam' });
    await service.record({ studentId: 's1', amount: 100, category: 'exam' });
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({ category: 'exam' })
    );
  });
});
