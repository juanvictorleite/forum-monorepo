import { CreateQuestionUseCase } from '@forum/domain';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { type UserPayload } from 'src/auth/jwt.strategy';
import { z } from 'zod';

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

class CreateQuestionDTO extends createZodDto(createQuestionBodySchema) {}

@Controller('/questions')
@ApiBearerAuth()
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}

  @Post()
  async handle(
    @Body() body: CreateQuestionDTO,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, content } = body;
    const userId = user.sub;

    const result = await this.createQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: [],
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
