import { Injectable, Logger } from '@nestjs/common';

type Payload = {
  channel: 'whatsapp' | 'email' | 'sms';
  recipient: string;
  template: string;
  payload?: Record<string, string>;
  logId: string;
};

@Injectable()
export class NotificationDispatcher {
  private readonly logger = new Logger(NotificationDispatcher.name);

  async dispatch(job: Payload): Promise<void> {
    const urlMap: Record<string, string | undefined> = {
      whatsapp: process.env.WHATSAPP_WEBHOOK_URL,
      email: process.env.EMAIL_WEBHOOK_URL,
      sms: process.env.SMS_WEBHOOK_URL,
    };

    const url = urlMap[job.channel];
    await this.sendWebhook(url, job);
  }

  private async sendWebhook(url: string | undefined, body: Payload): Promise<void> {
    if (!url) {
      this.logger.warn(`Webhook URL not configured for channel: ${body.channel}. Payload: ${JSON.stringify(body)}`);
      return;
    }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': process.env.NOTIFY_API_KEY || '',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        this.logger.error(`Webhook failed for ${body.channel}: ${res.status} ${res.statusText}`);
        throw new Error(`Webhook responded with ${res.status}`);
      }

      this.logger.log(`Notification sent via ${body.channel} to ${body.recipient}`);
    } catch (err) {
      this.logger.error(`Failed to dispatch ${body.channel} notification`, err);
      throw err;
    }
  }
}
