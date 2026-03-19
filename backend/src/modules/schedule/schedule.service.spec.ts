import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Schedule } from '../../entities/schedule.entity';

const mockRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('ScheduleService', () => {
  let service: ScheduleService;
  const repo = mockRepo();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleService,
        { provide: getRepositoryToken(Schedule), useValue: repo },
      ],
    }).compile();
    service = module.get<ScheduleService>(ScheduleService);
    jest.clearAllMocks();
  });

  it('creates a schedule', async () => {
    const dto = { title: 'رياضيات', groupName: 'أ', teacherName: 'أحمد', dayOfWeek: 'الأحد', startTime: '09:00', endTime: '10:00' };
    repo.create.mockReturnValue({ id: 's1', ...dto });
    repo.save.mockResolvedValue({ id: 's1', ...dto });
    const res = await service.create(dto);
    expect(res.id).toBe('s1');
  });

  it('lists all schedules', async () => {
    repo.find.mockResolvedValue([{ id: 's1' }, { id: 's2' }]);
    const res = await service.findAll();
    expect(res).toHaveLength(2);
  });

  it('throws NotFoundException when schedule not found', async () => {
    repo.findOne.mockResolvedValue(null);
    await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
  });

  it('removes a schedule', async () => {
    repo.findOne.mockResolvedValue({ id: 's1' });
    repo.delete.mockResolvedValue({});
    const res = await service.remove('s1');
    expect(res.ok).toBe(true);
  });
});
