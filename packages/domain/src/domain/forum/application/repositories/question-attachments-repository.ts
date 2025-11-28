import type { TransactionClient } from "@/core";
import type { QuestionAttachment } from "../../enterprise/entities/question-attachment";

export abstract class QuestionAttachmentsRepository {
  abstract createMany(
    attachments: QuestionAttachment[],
    trx?: TransactionClient,
  ): Promise<void>;
  abstract deleteMany(
    attachments: QuestionAttachment[],
    trx?: TransactionClient,
  ): Promise<void>;
  abstract findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]>;
  abstract deleteManyByQuestionId(questionId: string): Promise<void>;
}
