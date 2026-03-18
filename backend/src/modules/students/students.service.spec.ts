import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { StudentsService } from './students.service';
import { Student } from '../../entities/student.entity';

const mockRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('StudentsService', () => {
  let service: StudentsService;
  const repo = mockRepo();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        { provide: getRepositoryToken(Student), useValue: repo },
      ],
    }).compile();
    service = module.get<StudentsService>(StudentsService);
    jest.clearAllMocks();
  });

  it('creates a student', async () => {
    repo.create.mockReturnValue({ id: 's1', fullName: 'أحمد' });
    repo.save.mockResolvedValue({ id: 's1', fullName: 'أحمد' });
    const res = await service.create({ fullName: 'أحمد', code: 'STU-001' });
    expect(res.id).toBe('s1');
  });

  it('throws NotFoundException when student not found', async () => {
    repo.findOne.mockResolvedValue(null);
    await expect(service.get('nonexistent')).rejects.toThrow(NotFoundException);
  });

  it('lists all students', async () => {
    repo.find.mockResolvedValue([{ id: 's1' }, { id: 's2' }]);
    const res = await service.list();
    expect(res).toHaveLength(2);
  });
});
