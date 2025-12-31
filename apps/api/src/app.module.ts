import {
  ArgumentsHost,
  Catch,
  HttpException,
  Logger,
  Module,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  APP_FILTER,
  APP_INTERCEPTOR,
  APP_PIPE,
  BaseExceptionFilter,
} from '@nestjs/core';
import {
  ZodSerializationException,
  ZodSerializerInterceptor,
  ZodValidationPipe,
} from 'nestjs-zod';
import { ZodError } from 'zod';
import { AuthModule } from './auth/auth.module';
import { envSchema } from './env/env';
import { EnvModule } from './env/env.module';
import { EventsModule } from './events/events.module';
import { HttpModule } from './http/http.module';

@Catch(HttpException)
class HttpExceptionFilter extends BaseExceptionFilter {
  private logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    if (exception instanceof ZodSerializationException) {
      const zodError = exception.getZodError();

      if (zodError instanceof ZodError) {
        this.logger.error(`ZodSerializationException: ${zodError.message}`);
      }
    }

    super.catch(exception, host);
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
    EnvModule,
    EventsModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
