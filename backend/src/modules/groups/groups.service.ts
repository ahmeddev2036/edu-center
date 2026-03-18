import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../../entities/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';

@Injectable()
export class GroupsService {
  constructor(@InjectRepository(Group) private readonly repo: Repository<Group>) {}

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const g = await this.repo.findOne({ where: { id } });
    if (!g) throw new NotFoundException('المجموعة غير موجودة');
    return g;
  }

  create(dto: CreateGroupDto) {
    const g = this.repo.create({ ...dto, maxStudents: dto.maxStudents ?? 0 });
    return this.repo.save(g);
  }

  async update(id: string, dto: Partial<CreateGroupDto>) {
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
