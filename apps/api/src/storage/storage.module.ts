import { Uploader } from '@forum/domain';
import { Module } from '@nestjs/common';
import { EnvModule } from 'src/env/env.module';
import { R2Storage } from './r2-storage';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Uploader,
      useClass: R2Storage,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
