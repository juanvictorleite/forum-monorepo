import {
  QuestionAttachment,
  QuestionAttachmentsRepository,
  TransactionClient,
} from '@forum/domain';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';
import { PrismaQuestionAttachmentMapper } from '../mappers/prisma-question-attachment-mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const questionAttachments = await this.prisma.attachment.findMany({
      where: {
        questionId,
      },
    });

    return questionAttachments.map((questionAttachment) =>
      PrismaQuestionAttachmentMapper.toDomain(questionAttachment),
    );
  }

  async createMany(
    attachments: QuestionAttachment[],
    trx?: TransactionClient,
  ): Promise<void> {
    if (attachments.length === 0) {
      return;
    }

    const prismaClient = (trx ?? this.prisma) as PrismaClient;

    const data = PrismaQuestionAttachmentMapper.toPrismaUpdateMany(attachments);

    await prismaClient.attachment.updateMany(data);
  }

  async deleteMany(
    attachments: QuestionAttachment[],
    trx?: TransactionClient,
  ): Promise<void> {
    if (attachments.length === 0) {
      return;
    }

    const prismaClient = (trx ?? this.prisma) as PrismaClient;

    const attachmentIds = attachments.map((attachment) => {
      return attachment.id.toString();
    });

    await prismaClient.attachment.deleteMany({
      where: {
        id: {
          in: attachmentIds,
        },
      },
    });
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        questionId,
      },
    });
  }
}
