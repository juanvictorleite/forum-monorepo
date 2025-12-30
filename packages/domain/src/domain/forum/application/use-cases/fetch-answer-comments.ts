import { type Either, right } from "@/core/either";
import type { CommentWithAuthor } from "../../enterprise";
import type { AnswerCommentsRepository } from "../repositories/answer-comments-repository";

interface FetchAnswerCommentsUseCaseRequest {
  answerId: string;
  page: number;
}

type FetchAnswerCommentsUseCaseResponse = Either<
  null,
  {
    comments: CommentWithAuthor[];
  }
>;

export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const comments =
      await this.answerCommentsRepository.findManyByAnswerIdWithAuthor(
        answerId,
        {
          page,
        },
      );

    return right({
      comments,
    });
  }
}
