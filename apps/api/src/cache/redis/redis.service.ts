import { OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { EnvService } from 'src/env/env.service';

export class RedisService extends Redis implements OnModuleDestroy {
  constructor(envService: EnvService) {
    const host = envService.get('REDIS_HOST');
    const port = Number(envService.get('REDIS_PORT'));
    const db = Number(envService.get('REDIS_DB'));

    super({ host, port, db });
  }

  onModuleDestroy() {
    return this.disconnect();
  }
}
