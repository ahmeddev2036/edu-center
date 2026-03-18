import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../../entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(@InjectRepository(Message) private readonly repo: Repository<Message>) {}

  findAll() { return this.repo.find({ order: { createdAt: 'DESC' } }); }

  findForRecipient(recipientId: string) {
    return this.repo.find({
      where: [{ recipientId }, { recipientId: undefined }],
      order: { createdAt: 'DESC' },
    });
  }

  create(dto: CreateMessageDto) {
    return this.repo.save(this.repo.create(dto));
  }

  async markRead(id: string) {
    await this.repo.update(id, { isRead: true });
    return { ok: true };
  }

  async remove(id: string) {
    await this.repo.delete(id);
    return { ok: true };
  }
}
