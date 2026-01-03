import { Module } from '@nestjs/common';
import { EnvModule } from 'src/env/env.module';
import { EnvService } from 'src/env/env.service';

@Module({
  imports: [EnvModule],
  providers: [EnvService],
})
export class CacheModule {}
