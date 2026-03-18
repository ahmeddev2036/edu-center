import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from '../../entities/staff.entity';

@Injectable()
export class StaffService {
  constructor(@InjectRepository(Staff) private readonly repo: Repository<Staff>) {}

  create(data: Partial<Staff>) {
    const staff = this.repo.create(data);
    return this.repo.save(staff);
  }

  list() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async get(id: string) {
    const staff = await this.repo.findOne({ where: { id } });
    if (!staff) throw new NotFoundException('الموظف غير موجود');
    return staff;
  }

  async update(id: string, data: Partial<Staff>) {
    await this.get(id);
    await this.repo.update(id, data);
    return this.get(id);
  }

  async remove(id: string) {
    await this.get(id);
    await this.repo.delete(id);
    return { ok: true };
  }
}
