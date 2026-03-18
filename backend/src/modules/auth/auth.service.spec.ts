import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcrypt';

const mockRepo = () => ({ findOne: jest.fn() });

describe('AuthService', () => {
  let service: AuthService;
  const userRepo = mockRepo();
  const jwtService = { signAsync: jest.fn().mockResolvedValue('mock-token') };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: userRepo },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('returns error when user not found', async () => {
    userRepo.findOne.mockResolvedValue(null);
    const res = await service.login('x@x.com', 'pass');
    expect(res.ok).toBe(false);
  });

  it('returns error on wrong password', async () => {
    userRepo.findOne.mockResolvedValue({ passwordHash: await bcrypt.hash('correct', 10) });
    const res = await service.login('x@x.com', 'wrong');
    expect(res.ok).toBe(false);
  });

  it('returns token on valid credentials', async () => {
    const hash = await bcrypt.hash('pass123', 10);
    userRepo.findOne.mockResolvedValue({ id: 'u1', role: 'admin', passwordHash: hash });
    const res = await service.login('x@x.com', 'pass123');
    expect(res.ok).toBe(true);
    expect((res as any).token).toBe('mock-token');
  });
});
