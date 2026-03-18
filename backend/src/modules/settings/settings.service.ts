import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Settings } from '../../entities/settings.entity';

@Injectable()
export class SettingsService {
  constructor(@InjectRepository(Settings) private readonly repo: Repository<Settings>) {}

  async get() {
    let s = await this.repo.findOne({ where: {} });
    if (!s) {
      s = this.repo.create({ centerName: 'مركز التعليم', language: 'ar', currency: 'EGP' });
      await this.repo.save(s);
    }
    return s;
  }

  async update(data: Partial<Settings>) {
    const s = await this.get();
    Object.assign(s, data);
    return this.repo.save(s);
  }
}
