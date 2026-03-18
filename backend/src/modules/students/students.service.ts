import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../../entities/student.entity';

@Injectable()
export class StudentsService {
  constructor(@InjectRepository(Student) private readonly repo: Repository<Student>) {}

  create(data: Partial<Student>) {
    const student = this.repo.create(data);
    return this.repo.save(student);
  }

  list() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async get(id: string) {
    const student = await this.repo.findOne({ where: { id } });
    if (!student) throw new NotFoundException('الطالب غير موجود');
    return student;
  }

  async update(id: string, data: Partial<Student>) {
    await this.get(id);
    await this.repo.update(id, data);
    return this.get(id);
  }

  async remove(id: string) {
    await this.get(id);
    await this.repo.delete(id);
    return { ok: true };
  }

  findByCode(code: string) {
    return this.repo.findOne({ where: { code } });
  }

  async getParentView(code: string) {
    const student = await this.repo.findOne({ where: { code } });
    if (!student) return { ok: false, message: 'الكود غير صحيح' };
    return { ok: true, student };
  }
}
