import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { CommentWithAuthor } from "../../enterprise";
import type { QuestionComment } from "../../enterprise/entities/question-comment";

export abstract class QuestionCommentsRepository {
  abstract findById(id: string): Promise<QuestionComment | null>;

  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]>;

  abstract findManyByQuestionIdWithAuthor(
    questionId: string,
    params: PaginationParams,
  ): Promise<CommentWithAuthor[]>;

  abstract create(questionComment: QuestionComment): Promise<void>;

  abstract delete(questionComment: QuestionComment): Promise<void>;
}
