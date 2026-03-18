import type { RedisOptions } from 'ioredis';

function parseRedisUrl(urlStr: string): RedisOptions {
  const u = new URL(urlStr);
  return {
    host: u.hostname || 'localhost',
    port: Number(u.port || 6379),
    ...(u.password ? { password: u.password } : {}),
  };
}

export const redisOptions: RedisOptions = process.env.REDIS_URL
  ? parseRedisUrl(process.env.REDIS_URL)
  : {
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT || 6379),
    };
