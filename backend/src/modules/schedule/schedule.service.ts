import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from '../../entities/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(@InjectRepository(Schedule) private readonly repo: Repository<Schedule>) {}

  findAll() { return this.repo.find({ order: { dayOfWeek: 'ASC', startTime: 'ASC' } }); }

  async findOne(id: string) {
    const s = await this.repo.findOne({ where: { id } });
    if (!s) throw new NotFoundException('الحصة غير موجودة');
    return s;
  }

  create(dto: CreateScheduleDto) {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: Partial<CreateScheduleDto>) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { ok: true };
  }
}
