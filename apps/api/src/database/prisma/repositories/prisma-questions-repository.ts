import type {
  PaginationParams,
  Question,
  QuestionDetails,
  QuestionsRepository,
} from '@forum/domain';
import { QuestionAttachmentsRepository } from '@forum/domain';
import { Injectable } from '@nestjs/common';
import { PrismaQuestionDetailsMapper } from '../mappers/prisma-question-details-mapper';
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private prisma: PrismaService,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        id,
      },
    });

    if (!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
    });

    if (!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
      include: {
        author: true,
        attachments: true,
      },
    });

    if (!question) {
      return null;
    }

    return PrismaQuestionDetailsMapper.toDomain(question);
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return questions.map((question) => PrismaQuestionMapper.toDomain(question));
  }

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question);

    await this.prisma.$transaction(async (trx) => {
      await trx.question.create({
        data,
      });

      await this.questionAttachmentsRepository.createMany(
        question.attachments.getItems(),
        trx,
      );
    });
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question);

    await this.prisma.$transaction(async (trx) => {
      await trx.question.update({
        where: {
          id: question.id.toString(),
        },
        data,
      });

      await this.questionAttachmentsRepository.createMany(
        question.attachments.getNewItems(),
        trx,
      );

      await this.questionAttachmentsRepository.deleteMany(
        question.attachments.getRemovedItems(),
        trx,
      );
    });
  }

  async delete(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question);

    await this.prisma.question.delete({
      where: {
        id: data.id,
      },
    });
  }
}
