import { EditQuestionUseCase } from '@forum/domain';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { type UserPayload } from 'src/auth/jwt.strategy';
import { z } from 'zod';

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

class EditQuestionDTO extends createZodDto(editQuestionBodySchema) {}

@Controller('/questions/:id')
@ApiBearerAuth()
export class EditQuestionController {
  constructor(private editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body() body: EditQuestionDTO,
    @CurrentUser() user: UserPayload,
    @Param('id') questionId: string,
  ) {
    const { title, content } = body;
    const userId = user.sub;

    const result = await this.editQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: [],
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
