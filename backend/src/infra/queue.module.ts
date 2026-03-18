import { Global, Module } from '@nestjs/common';
import { Queue, Worker } from 'bullmq';
import { NotificationDispatcher } from './notification-dispatcher';
import { redisOptions } from './redis.config';

@Global()
@Module({
  providers: [
    NotificationDispatcher,
    {
      provide: 'NOTIFY_QUEUE',
      useFactory: () => {
        const q = new Queue('notify', {
          connection: redisOptions,
        });
        q.on('error', err => {
          // eslint-disable-next-line no-console
          console.warn('[Queue] Redis not available:', err.message);
        });
        return q;
      },
    },
    {
      provide: 'NOTIFY_WORKER',
      inject: [NotificationDispatcher],
      useFactory: (dispatcher: NotificationDispatcher) => {
        const w = new Worker(
          'notify',
          async job => {
            await dispatcher.dispatch(job.data);
          },
          { connection: redisOptions }
        );
        w.on('error', err => {
          // eslint-disable-next-line no-console
          console.warn('[Worker] Redis not available:', err.message);
        });
        return w;
      },
    },
  ],
  exports: ['NOTIFY_QUEUE'],
})
export class QueueModule {}
