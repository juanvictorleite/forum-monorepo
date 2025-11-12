import {
  AuthenticateStudentUseCase,
  CreateQuestionUseCase,
  Encrypter,
  FetchRecentQuestionsUseCase,
  HashComparer,
  QuestionsRepository,
  StudentsRepository,
} from '@forum/domain';
import { Module } from '@nestjs/common';
import { BcryptHasher } from 'src/cryptography/bcrypt-hasher';
import { CryptographyModule } from 'src/cryptography/cryptography.module';
import { JwtEncrypter } from 'src/cryptography/jwt-encrypter';
import { DatabaseModule } from 'src/database/database.module';
import { PrismaQuestionsRepository } from 'src/database/prisma/repositories/prisma-questions-repository';
import { PrismaStudentsRepository } from 'src/database/prisma/repositories/prisma-students-repository';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [
    {
      provide: CreateQuestionUseCase,
      useFactory: (repo: QuestionsRepository) =>
        new CreateQuestionUseCase(repo),
      inject: [PrismaQuestionsRepository],
    },
    {
      provide: FetchRecentQuestionsUseCase,
      useFactory: (repo: QuestionsRepository) =>
        new FetchRecentQuestionsUseCase(repo),
      inject: [PrismaQuestionsRepository],
    },
    {
      provide: AuthenticateStudentUseCase,
      useFactory: (
        repo: StudentsRepository,
        hashComparer: HashComparer,
        encrypter: Encrypter,
      ) => new AuthenticateStudentUseCase(repo, hashComparer, encrypter),
      inject: [PrismaStudentsRepository, BcryptHasher, JwtEncrypter],
    },
  ],
})
export class HttpModule {}
