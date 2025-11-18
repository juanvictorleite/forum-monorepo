import {
  AuthenticateStudentUseCase,
  CreateQuestionUseCase,
  EditQuestionUseCase,
  Encrypter,
  FetchRecentQuestionsUseCase,
  GetQuestionBySlugUseCase,
  HashComparer,
  HashGenerator,
  QuestionAttachmentsRepository,
  QuestionsRepository,
  RegisterStudentUseCase,
  StudentsRepository,
} from '@forum/domain';
import { Module } from '@nestjs/common';
import { BcryptHasher } from 'src/cryptography/bcrypt-hasher';
import { CryptographyModule } from 'src/cryptography/cryptography.module';
import { JwtEncrypter } from 'src/cryptography/jwt-encrypter';
import { DatabaseModule } from 'src/database/database.module';
import { PrismaQuestionAttachmentsRepository } from 'src/database/prisma/repositories/prisma-question-attachments-repository';
import { PrismaQuestionsRepository } from 'src/database/prisma/repositories/prisma-questions-repository';
import { PrismaStudentsRepository } from 'src/database/prisma/repositories/prisma-students-repository';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { EditQuestionController } from './controllers/edit-question.controller';
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller';
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
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
    {
      provide: RegisterStudentUseCase,
      useFactory: (repo: StudentsRepository, hashGenerator: HashGenerator) =>
        new RegisterStudentUseCase(repo, hashGenerator),
      inject: [PrismaStudentsRepository, BcryptHasher],
    },
    {
      provide: GetQuestionBySlugUseCase,
      useFactory: (repo: QuestionsRepository) =>
        new GetQuestionBySlugUseCase(repo),
      inject: [PrismaQuestionsRepository],
    },
    {
      provide: EditQuestionUseCase,
      useFactory: (
        questionsRepo: QuestionsRepository,
        questionAttachmentsRepo: QuestionAttachmentsRepository,
      ) => new EditQuestionUseCase(questionsRepo, questionAttachmentsRepo),
      inject: [PrismaQuestionsRepository, PrismaQuestionAttachmentsRepository],
    },
  ],
})
export class HttpModule {}
