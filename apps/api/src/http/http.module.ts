import {
  AnswerAttachmentsRepository,
  AnswerCommentsRepository,
  AnswerQuestionUseCase,
  AnswersRepository,
  AttachmentsRepository,
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
  FetchAnswerCommentsUseCase,
  FetchQuestionAnswersUseCase,
  FetchQuestionCommentsUseCase,
  FetchRecentQuestionsUseCase,
  GetQuestionBySlugUseCase,
  HashComparer,
  HashGenerator,
  NotificationsRepository,
  QuestionAttachmentsRepository,
  QuestionCommentsRepository,
  QuestionsRepository,
  ReadNotificationUseCase,
  RegisterStudentUseCase,
  StudentsRepository,
  UploadAndCreateAttachmentUseCase,
  Uploader,
} from '@forum/domain';
import { Module } from '@nestjs/common';
import { CryptographyModule } from 'src/cryptography/cryptography.module';
import { DatabaseModule } from 'src/database/database.module';
import { StorageModule } from 'src/storage/storage.module';
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
import { FetchAnswerCommentsController } from './controllers/fetch-answer-comments.controller';
import { FetchQuestionAnswersController } from './controllers/fetch-question-answers.controller';
import { FetchQuestionCommentsController } from './controllers/fetch-question-comments.controller';
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller';
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller';
import { ReadNotificationController } from './controllers/read-notification.controller';
import { UploadAttachmentController } from './controllers/upload-attachment.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
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
    FetchQuestionCommentsController,
    FetchAnswerCommentsController,
    UploadAttachmentController,
    ReadNotificationController,
  ],
  providers: [
    {
      provide: CreateQuestionUseCase,
      useFactory: (repo: QuestionsRepository) =>
        new CreateQuestionUseCase(repo),
      inject: [QuestionsRepository],
    },
    {
      provide: FetchRecentQuestionsUseCase,
      useFactory: (repo: QuestionsRepository) =>
        new FetchRecentQuestionsUseCase(repo),
      inject: [QuestionsRepository],
    },
    {
      provide: AuthenticateStudentUseCase,
      useFactory: (
        repo: StudentsRepository,
        hashComparer: HashComparer,
        encrypter: Encrypter,
      ) => new AuthenticateStudentUseCase(repo, hashComparer, encrypter),
      inject: [StudentsRepository, HashComparer, Encrypter],
    },
    {
      provide: RegisterStudentUseCase,
      useFactory: (repo: StudentsRepository, hashGenerator: HashGenerator) =>
        new RegisterStudentUseCase(repo, hashGenerator),
      inject: [StudentsRepository, HashGenerator],
    },
    {
      provide: GetQuestionBySlugUseCase,
      useFactory: (repo: QuestionsRepository) =>
        new GetQuestionBySlugUseCase(repo),
      inject: [QuestionsRepository],
    },
    {
      provide: EditQuestionUseCase,
      useFactory: (
        questionsRepo: QuestionsRepository,
        questionAttachmentsRepo: QuestionAttachmentsRepository,
      ) => new EditQuestionUseCase(questionsRepo, questionAttachmentsRepo),
      inject: [QuestionsRepository, QuestionAttachmentsRepository],
    },
    {
      provide: DeleteQuestionUseCase,
      useFactory: (repo: QuestionsRepository) =>
        new DeleteQuestionUseCase(repo),
      inject: [QuestionsRepository],
    },
    {
      provide: AnswerQuestionUseCase,
      useFactory: (repo: AnswersRepository) => new AnswerQuestionUseCase(repo),
      inject: [AnswersRepository],
    },
    {
      provide: EditAnswerUseCase,
      useFactory: (
        repo: AnswersRepository,
        attRepo: AnswerAttachmentsRepository,
      ) => new EditAnswerUseCase(repo, attRepo),
      inject: [AnswersRepository, AnswerAttachmentsRepository],
    },
    {
      provide: DeleteAnswerUseCase,
      useFactory: (repo: AnswersRepository) => new DeleteAnswerUseCase(repo),
      inject: [AnswersRepository],
    },
    {
      provide: FetchQuestionAnswersUseCase,
      useFactory: (repo: AnswersRepository) =>
        new FetchQuestionAnswersUseCase(repo),
      inject: [AnswersRepository],
    },
    {
      provide: ChooseQuestionBestAnswerUseCase,
      useFactory: (
        questionsRepo: QuestionsRepository,
        answersRepo: AnswersRepository,
      ) => new ChooseQuestionBestAnswerUseCase(questionsRepo, answersRepo),
      inject: [QuestionsRepository, AnswersRepository],
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
      inject: [QuestionsRepository, QuestionCommentsRepository],
    },
    {
      provide: DeleteQuestionCommentUseCase,
      useFactory: (repo: QuestionCommentsRepository) =>
        new DeleteQuestionCommentUseCase(repo),
      inject: [QuestionCommentsRepository],
    },
    {
      provide: CommentOnAnswerUseCase,
      useFactory: (
        answersRepository: AnswersRepository,
        answerCommentsRepository: AnswerCommentsRepository,
      ) =>
        new CommentOnAnswerUseCase(answersRepository, answerCommentsRepository),
      inject: [AnswersRepository, AnswerCommentsRepository],
    },
    {
      provide: DeleteAnswerCommentUseCase,
      useFactory: (repo: AnswerCommentsRepository) =>
        new DeleteAnswerCommentUseCase(repo),
      inject: [AnswerCommentsRepository],
    },
    {
      provide: FetchQuestionCommentsUseCase,
      useFactory: (repo: QuestionCommentsRepository) =>
        new FetchQuestionCommentsUseCase(repo),
      inject: [QuestionCommentsRepository],
    },
    {
      provide: FetchAnswerCommentsUseCase,
      useFactory: (repo: AnswerCommentsRepository) =>
        new FetchAnswerCommentsUseCase(repo),
      inject: [AnswerCommentsRepository],
    },
    {
      provide: UploadAndCreateAttachmentUseCase,
      useFactory: (repo: AttachmentsRepository, uploader: Uploader) =>
        new UploadAndCreateAttachmentUseCase(repo, uploader),
      inject: [AttachmentsRepository, Uploader],
    },
    {
      provide: ReadNotificationUseCase,
      useFactory: (repo: NotificationsRepository) =>
        new ReadNotificationUseCase(repo),
      inject: [NotificationsRepository],
    },
  ],
})
export class HttpModule {}
