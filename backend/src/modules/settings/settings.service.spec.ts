import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SettingsService } from './settings.service';
import { Settings } from '../../entities/settings.entity';

const mockRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
});

describe('SettingsService', () => {
  let service: SettingsService;
  const repo = mockRepo();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SettingsService,
        { provide: getRepositoryToken(Settings), useValue: repo },
      ],
    }).compile();
    service = module.get<SettingsService>(SettingsService);
    jest.clearAllMocks();
  });

  it('returns existing settings', async () => {
    const existing = { id: 's1', centerName: 'مركز التعليم', language: 'ar', currency: 'EGP' };
    repo.findOne.mockResolvedValue(existing);
    const res = await service.get();
    expect(res.centerName).toBe('مركز التعليم');
  });

  it('creates default settings if none exist', async () => {
    repo.findOne.mockResolvedValue(null);
    repo.create.mockReturnValue({ centerName: 'مركز التعليم', language: 'ar', currency: 'EGP' });
    repo.save.mockResolvedValue({ id: 's1', centerName: 'مركز التعليم', language: 'ar', currency: 'EGP' });
    const res = await service.get();
    expect(repo.create).toHaveBeenCalled();
    expect(res.centerName).toBe('مركز التعليم');
  });

  it('updates settings', async () => {
    const existing = { id: 's1', centerName: 'مركز التعليم', language: 'ar', currency: 'EGP' };
    repo.findOne.mockResolvedValue(existing);
    repo.save.mockResolvedValue({ ...existing, centerName: 'مركز جديد' });
    const res = await service.update({ centerName: 'مركز جديد' });
    expect(res.centerName).toBe('مركز جديد');
  });
});
