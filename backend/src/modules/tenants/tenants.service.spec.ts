import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { Tenant } from '../../entities/tenant.entity';
import { Subscription } from '../../entities/subscription.entity';

const mockRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
});

describe('TenantsService', () => {
  let service: TenantsService;
  const tenantRepo = mockRepo();
  const subRepo = mockRepo();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantsService,
        { provide: getRepositoryToken(Tenant), useValue: tenantRepo },
        { provide: getRepositoryToken(Subscription), useValue: subRepo },
      ],
    }).compile();
    service = module.get<TenantsService>(TenantsService);
    jest.clearAllMocks();
  });

  it('creates a tenant with trial plan', async () => {
    tenantRepo.findOne.mockResolvedValue(null);
    tenantRepo.create.mockReturnValue({ id: 't1', slug: 'myschool', plan: 'trial' });
    tenantRepo.save.mockResolvedValue({ id: 't1', slug: 'myschool', plan: 'trial' });
    const res = await service.create({ slug: 'myschool', name: 'مدرستي' });
    expect(res.plan).toBe('trial');
  });

  it('throws ConflictException on duplicate slug', async () => {
    tenantRepo.findOne.mockResolvedValue({ id: 't1', slug: 'myschool' });
    await expect(service.create({ slug: 'myschool', name: 'مدرستي' })).rejects.toThrow(ConflictException);
  });

  it('throws NotFoundException when tenant not found', async () => {
    tenantRepo.findOne.mockResolvedValue(null);
    await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
  });

  it('creates subscription with correct amount', async () => {
    subRepo.create.mockReturnValue({ id: 'sub1', plan: 'pro', amount: 199 });
    subRepo.save.mockResolvedValue({ id: 'sub1', plan: 'pro', amount: 199 });
    tenantRepo.update.mockResolvedValue({});
    const res = await service.createSubscription('t1', 'pro', 'monthly');
    expect(res.amount).toBe(199);
  });
});
