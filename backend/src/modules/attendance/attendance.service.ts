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

  async markByQr(code: string, sessionDate?: string) {
    const date = sessionDate ?? new Date().toISOString().slice(0, 10);
    const student = await this.students.findOne({ where: { code } });
    if (!student) return { ok: false, message: 'الكود غير موجود' };
    const existing = await this.repo.findOne({ where: { student: { id: student.id }, sessionDate: date } });
    if (existing) return { ok: true, alreadyMarked: true, student };
    const record = this.repo.create({ student, sessionDate: date, present: true });
    await this.repo.save(record);
    return { ok: true, alreadyMarked: false, student };
  }
}
