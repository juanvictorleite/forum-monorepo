import {
  AnswerAttachmentsRepository,
  AnswerCommentsRepository,
  AnswerQuestionUseCase,
  AnswersRepository,
  AuthenticateStudentUseCase,
  ChooseQuestionBestAnswerUseCase,
  CommentOnAnswerUseCase,
  CommentOnQuestionUseCase,
  CreateQuestionUseCase,
  DeleteAnswerCommentUseCase,
  DeleteAnswerUseCase,
  DeleteQuestionCommentUseCase,
  DeleteQuestionUseCase,
  EditAnswerUseCase,
  EditQuestionUseCase,
  Encrypter,
  FetchQuestionAnswersUseCase,
  FetchRecentQuestionsUseCase,
  GetQuestionBySlugUseCase,
  HashComparer,
  HashGenerator,
  QuestionAttachmentsRepository,
  QuestionCommentsRepository,
  QuestionsRepository,
  RegisterStudentUseCase,
  StudentsRepository,
} from '@forum/domain';
import { Module } from '@nestjs/common';
import { BcryptHasher } from 'src/cryptography/bcrypt-hasher';
import { CryptographyModule } from 'src/cryptography/cryptography.module';
import { JwtEncrypter } from 'src/cryptography/jwt-encrypter';
import { DatabaseModule } from 'src/database/database.module';
import { PrismaAnswerAttachmentsRepository } from 'src/database/prisma/repositories/prisma-answer-attachments-repository';
import { PrismaAnswerCommentsRepository } from 'src/database/prisma/repositories/prisma-answer-comments-repository';
import { PrismaAnswersRepository } from 'src/database/prisma/repositories/prisma-answers-repository';
import { PrismaQuestionAttachmentsRepository } from 'src/database/prisma/repositories/prisma-question-attachments-repository';
import { PrismaQuestionCommentsRepository } from 'src/database/prisma/repositories/prisma-question-comments-repository';
import { PrismaQuestionsRepository } from 'src/database/prisma/repositories/prisma-questions-repository';
import { PrismaStudentsRepository } from 'src/database/prisma/repositories/prisma-students-repository';
import { AnswerQuestionController } from './controllers/answer-question.controller';
import { AuthenticateController } from './controllers/authenticate.controller';
import { ChooseQuestionBestAnswerController } from './controllers/choose-question-best-answer.controller';
import { CommentOnAnswerController } from './controllers/comment-on-answer.controller';
import { CommentOnQuestionController } from './controllers/comment-on-question.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { DeleteAnswerCommentController } from './controllers/delete-answer-comment.controller';
import { DeleteAnswerController } from './controllers/delete-answer.controller';
import { DeleteQuestionCommentController } from './controllers/delete-question-comment.controller';
import { DeleteQuestionController } from './controllers/delete-question.controller';
import { EditAnswerController } from './controllers/edit-answer.controller';
import { EditQuestionController } from './controllers/edit-question.controller';
import { FetchQuestionAnswersController } from './controllers/fetch-question-answers.controller';
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
    DeleteQuestionController,
    AnswerQuestionController,
    EditAnswerController,
    DeleteAnswerController,
    FetchQuestionAnswersController,
    ChooseQuestionBestAnswerController,
    CommentOnQuestionController,
    DeleteQuestionCommentController,
    CommentOnAnswerController,
    DeleteAnswerCommentController,
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
    {
      provide: DeleteQuestionUseCase,
      useFactory: (repo: QuestionsRepository) =>
        new DeleteQuestionUseCase(repo),
      inject: [PrismaQuestionsRepository],
    },
    {
      provide: AnswerQuestionUseCase,
      useFactory: (repo: AnswersRepository) => new AnswerQuestionUseCase(repo),
      inject: [PrismaAnswersRepository],
    },
    {
      provide: EditAnswerUseCase,
      useFactory: (
        repo: AnswersRepository,
        attRepo: AnswerAttachmentsRepository,
      ) => new EditAnswerUseCase(repo, attRepo),
      inject: [PrismaAnswersRepository, PrismaAnswerAttachmentsRepository],
    },
    {
      provide: DeleteAnswerUseCase,
      useFactory: (repo: AnswersRepository) => new DeleteAnswerUseCase(repo),
      inject: [PrismaAnswersRepository],
    },
    {
      provide: FetchQuestionAnswersUseCase,
      useFactory: (repo: AnswersRepository) =>
        new FetchQuestionAnswersUseCase(repo),
      inject: [PrismaAnswersRepository],
    },
    {
      provide: ChooseQuestionBestAnswerUseCase,
      useFactory: (
        questionsRepo: QuestionsRepository,
        answersRepo: AnswersRepository,
      ) => new ChooseQuestionBestAnswerUseCase(questionsRepo, answersRepo),
      inject: [PrismaQuestionsRepository, PrismaAnswersRepository],
    },
    {
      provide: CommentOnQuestionUseCase,
      useFactory: (
        questionsRepository: QuestionsRepository,
        questionCommentsRepository: QuestionCommentsRepository,
      ) =>
        new CommentOnQuestionUseCase(
          questionsRepository,
          questionCommentsRepository,
        ),
      inject: [PrismaQuestionsRepository, PrismaQuestionCommentsRepository],
    },
    {
      provide: DeleteQuestionCommentUseCase,
      useFactory: (repo: QuestionCommentsRepository) =>
        new DeleteQuestionCommentUseCase(repo),
      inject: [PrismaQuestionCommentsRepository],
    },
    {
      provide: CommentOnAnswerUseCase,
      useFactory: (
        answersRepository: AnswersRepository,
        answerCommentsRepository: AnswerCommentsRepository,
      ) =>
        new CommentOnAnswerUseCase(answersRepository, answerCommentsRepository),
      inject: [PrismaAnswersRepository, PrismaAnswerCommentsRepository],
    },
    {
      provide: DeleteAnswerCommentUseCase,
      useFactory: (repo: AnswerCommentsRepository) =>
        new DeleteAnswerCommentUseCase(repo),
      inject: [PrismaAnswerCommentsRepository],
    },
  ],
})
export class HttpModule {}
