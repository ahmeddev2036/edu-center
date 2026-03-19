import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MessagesService } from './messages.service';
import { Message } from '../../entities/message.entity';

const mockRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('MessagesService', () => {
  let service: MessagesService;
  const repo = mockRepo();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        { provide: getRepositoryToken(Message), useValue: repo },
      ],
    }).compile();
    service = module.get<MessagesService>(MessagesService);
    jest.clearAllMocks();
  });

  it('creates a message', async () => {
    const dto = { senderName: 'أحمد', senderRole: 'admin', content: 'مرحباً' };
    repo.create.mockReturnValue({ id: 'm1', ...dto });
    repo.save.mockResolvedValue({ id: 'm1', ...dto });
    const res = await service.create(dto);
    expect(res.id).toBe('m1');
  });

  it('lists all messages', async () => {
    repo.find.mockResolvedValue([{ id: 'm1' }, { id: 'm2' }]);
    const res = await service.findAll();
    expect(res).toHaveLength(2);
  });

  it('marks message as read', async () => {
    repo.update.mockResolvedValue({});
    const res = await service.markRead('m1');
    expect(res.ok).toBe(true);
    expect(repo.update).toHaveBeenCalledWith('m1', { isRead: true });
  });

  it('removes a message', async () => {
    repo.delete.mockResolvedValue({});
    const res = await service.remove('m1');
    expect(res.ok).toBe(true);
  });
});
