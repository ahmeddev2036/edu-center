import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { Group } from '../../entities/group.entity';

const mockRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('GroupsService', () => {
  let service: GroupsService;
  const repo = mockRepo();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsService,
        { provide: getRepositoryToken(Group), useValue: repo },
      ],
    }).compile();
    service = module.get<GroupsService>(GroupsService);
    jest.clearAllMocks();
  });

  it('creates a group', async () => {
    repo.create.mockReturnValue({ id: 'g1', name: 'المجموعة أ' });
    repo.save.mockResolvedValue({ id: 'g1', name: 'المجموعة أ' });
    const res = await service.create({ name: 'المجموعة أ' });
    expect(res.id).toBe('g1');
  });

  it('lists all groups', async () => {
    repo.find.mockResolvedValue([{ id: 'g1' }, { id: 'g2' }]);
    const res = await service.findAll();
    expect(res).toHaveLength(2);
  });

  it('throws NotFoundException when group not found', async () => {
    repo.findOne.mockResolvedValue(null);
    await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
  });

  it('removes a group', async () => {
    repo.findOne.mockResolvedValue({ id: 'g1' });
    repo.delete.mockResolvedValue({});
    const res = await service.remove('g1');
    expect(res.ok).toBe(true);
  });
});
