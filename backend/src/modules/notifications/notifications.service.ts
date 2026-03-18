import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { Repository } from 'typeorm';
import { NotificationLog } from '../../entities/notification-log.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationLog) private readonly logs: Repository<NotificationLog>,
    @Inject('NOTIFY_QUEUE') private readonly notifyQueue: Queue
  ) {}

  async send(
    channel: 'whatsapp' | 'email' | 'sms',
    recipient: string,
    template: string,
    payload?: Record<string, string>
  ) {
    const entry = this.logs.create({ channel, recipient, template, status: 'queued' });
    await this.logs.save(entry);
    await this.notifyQueue.add('dispatch', { channel, recipient, template, payload, logId: entry.id });
    return { ok: true, id: entry.id };
  }

  async updateStatus(logId: string, status: 'sent' | 'failed') {
    await this.logs.update(logId, { status });
  }

  getLogs() {
    return this.logs.find({ order: { createdAt: 'DESC' }, take: 100 });
  }
}
