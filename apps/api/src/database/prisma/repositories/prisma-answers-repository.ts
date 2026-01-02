import {
  Answer,
  AnswerAttachmentsRepository,
  AnswersRepository,
  DomainEvents,
  PaginationParams,
} from '@forum/domain';
import { Injectable } from '@nestjs/common';
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(
    private prisma: PrismaService,
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({
      where: {
        id,
      },
    });

    if (!answer) {
      return null;
    }

    return PrismaAnswerMapper.toDomain(answer);
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return answers.map((answer) => PrismaAnswerMapper.toDomain(answer));
  }

  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer);

    await this.prisma.$transaction(async (trx) => {
      await trx.answer.create({
        data,
      });

      await this.answerAttachmentsRepository.createMany(
        answer.attachments.getItems(),
        trx,
      );
    });

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer);

    await this.prisma.$transaction(async (trx) => {
      await trx.answer.update({
        where: {
          id: answer.id.toString(),
        },
        data,
      });

      await this.answerAttachmentsRepository.createMany(
        answer.attachments.getNewItems(),
        trx,
      );

      await this.answerAttachmentsRepository.deleteMany(
        answer.attachments.getRemovedItems(),
        trx,
      );
    });

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async delete(answer: Answer): Promise<void> {
    await this.prisma.answer.delete({
      where: {
        id: answer.id.toString(),
      },
    });
  }
}
