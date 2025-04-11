import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: RedisClientType;

  async onModuleInit() {
    this.client = createClient({
      url: 'redis://127.0.0.1:6379',
    });

    this.client.on('error', (err) => console.error('Redis Error:', err));

    await this.client.connect();
    console.log('Redis connected');
  }

  async set(key: string, value: any): Promise<void> {
    console.log(`[REDIS] SET key = ${key}`);
    await this.client.set(key, JSON.stringify(value));
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    console.log(`[REDIS] GET key = ${key} | Hit = ${!!data}`);
    return data ? JSON.parse(data) : null;
  }

  async del(key: string): Promise<void> {
    console.log(`[REDIS] DEL key = ${key}`);
    await this.client.del(key);
  }
}
