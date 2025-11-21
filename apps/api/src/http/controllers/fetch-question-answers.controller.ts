import { FetchQuestionAnswersUseCase } from '@forum/domain';
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';
import { AnswerPresenter } from '../presenters/answer-presenter';

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/questions/:questionId/answers')
@ApiBearerAuth()
export class FetchQuestionAnswersController {
  constructor(private fetchQuestionAnswers: FetchQuestionAnswersUseCase) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Param('questionId') questionId: string,
  ) {
    const result = await this.fetchQuestionAnswers.execute({
      page,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const answers = result.value.answers;

    return { answers: answers.map((answer) => AnswerPresenter.toHTTP(answer)) };
  }
}
