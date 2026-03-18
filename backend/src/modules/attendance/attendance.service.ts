import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttendanceRecord } from '../../entities/attendance.entity';
import { Student } from '../../entities/student.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceRecord) private readonly repo: Repository<AttendanceRecord>,
    @InjectRepository(Student) private readonly students: Repository<Student>
  ) {}

  async mark(data: { studentId: string; sessionDate: string; present: boolean; note?: string }) {
    const student = await this.students.findOne({ where: { id: data.studentId } });
    if (!student) return { ok: false, message: 'الطالب غير موجود' };
    const record = this.repo.create({ ...data, student });
    await this.repo.save(record);
    return { ok: true, record };
  }

  listForStudent(studentId: string) {
    return this.repo.find({
      where: { student: { id: studentId } },
      relations: ['student'],
      order: { sessionDate: 'DESC' },
    });
  }

  listForSession(date: string) {
    return this.repo.find({
      where: { sessionDate: date },
      relations: ['student'],
    });
  }
}
