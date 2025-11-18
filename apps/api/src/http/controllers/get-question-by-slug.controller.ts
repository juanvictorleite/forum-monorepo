import { GetQuestionBySlugUseCase } from '@forum/domain';
import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { QuestionPresenter } from '../presenters/question-presenter';

@Controller('/questions/:slug')
@ApiBearerAuth()
export class GetQuestionBySlugController {
  constructor(private getQuestionBySlug: GetQuestionBySlugUseCase) {}

  @Get()
  async handle(@Param('slug') slug: string) {
    const result = await this.getQuestionBySlug.execute({
      slug,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    return { question: QuestionPresenter.toHTTP(result.value.question) };
  }
}
