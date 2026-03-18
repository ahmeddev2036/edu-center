import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AttendanceService } from './attendance.service';
import { AttendanceRecord } from '../../entities/attendance.entity';
import { Student } from '../../entities/student.entity';

const mockRepo = () => ({ create: jest.fn(), save: jest.fn(), findOne: jest.fn(), find: jest.fn() });

describe('AttendanceService', () => {
  let service: AttendanceService;
  const attendanceRepo = mockRepo();
  const studentRepo = mockRepo();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
        { provide: getRepositoryToken(AttendanceRecord), useValue: attendanceRepo },
        { provide: getRepositoryToken(Student), useValue: studentRepo }
      ]
    }).compile();

    service = module.get<AttendanceService>(AttendanceService);
    jest.clearAllMocks();
  });

  it('rejects when student missing', async () => {
    studentRepo.findOne.mockResolvedValue(null);
    const res = await service.mark({ studentId: 'x', sessionDate: '2026-03-13', present: true });
    expect(res.ok).toBe(false);
  });

  it('creates attendance record', async () => {
    studentRepo.findOne.mockResolvedValue({ id: 'stu1' });
    attendanceRepo.create.mockReturnValue({ id: 'rec1' });
    attendanceRepo.save.mockResolvedValue({ id: 'rec1' });
    const res = await service.mark({ studentId: 'stu1', sessionDate: '2026-03-13', present: true });
    expect(res.ok).toBe(true);
    expect(attendanceRepo.create).toHaveBeenCalled();
  });
});
