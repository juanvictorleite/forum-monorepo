import { QuestionsRepository } from '@forum/domain';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { CacheRepository } from 'src/cache/cache-repository';
import { CacheModule } from 'src/cache/cache.module';
import { DatabaseModule } from 'src/database/database.module';
import { AttachmentFactory } from 'test/factories/attachment-factory';
import { QuestionAttachmentFactory } from 'test/factories/question-attachment-factory';
import { QuestionFactory } from 'test/factories/question-factory';
import { StudentFactory } from 'test/factories/student-factory';

describe('Prisma Questions Repository (E2E)', () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;
  let questionAttachmentFactory: QuestionAttachmentFactory;
  let cacheRepository: CacheRepository;
  let questionsRepository: QuestionsRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);
    cacheRepository = moduleRef.get(CacheRepository);
    questionsRepository = moduleRef.get(QuestionsRepository);

    await app.init();
  });

  it('should cache question details', async () => {
    const user = await studentFactory.makePrismaStudent();

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const attachment = await attachmentFactory.makePrismaAttachment();

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    });

    const slug = question.slug.value;

    const questionDetails = await questionsRepository.findDetailsBySlug(slug);

    const cached = await cacheRepository.get(`question:${slug}:details`);

    if (!cached) {
      throw new Error('Question details not cached');
    }

    expect(JSON.parse(cached)).toEqual(
      expect.objectContaining({ id: questionDetails?.questionId.toString() }),
    );
  });

  it('should return cached question details on subsequent calls', async () => {
    const user = await studentFactory.makePrismaStudent();

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const attachment = await attachmentFactory.makePrismaAttachment();

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    });

    const slug = question.slug.value;

    let cached = await cacheRepository.get(`question:${slug}:details`);

    expect(cached).toBeNull();

    await questionsRepository.findDetailsBySlug(slug);

    cached = await cacheRepository.get(`question:${slug}:details`);

    expect(cached).not.toBeNull();

    if (!cached) {
      throw new Error('Question details not cached');
    }

    const questionDetails = await questionsRepository.findDetailsBySlug(slug);

    expect(JSON.parse(cached)).toEqual(
      expect.objectContaining({ id: questionDetails?.questionId.toString() }),
    );
  });

  it('should reset question details cache when saving the question', async () => {
    const user = await studentFactory.makePrismaStudent();

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const attachment = await attachmentFactory.makePrismaAttachment();

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    });

    const slug = question.slug.value;

    await cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify({ empty: true }),
    );

    await questionsRepository.save(question);

    const cached = await cacheRepository.get(`question:${slug}:details`);

    expect(cached).toBeNull();
  });
});
