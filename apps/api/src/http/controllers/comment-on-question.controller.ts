import { CommentOnQuestionUseCase } from '@forum/domain';
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { type UserPayload } from 'src/auth/jwt.strategy';
import { z } from 'zod';

const commentOnQuestionBodySchema = z.object({
  content: z.string(),
});

class CommentOnQuestionDTO extends createZodDto(commentOnQuestionBodySchema) {}

@Controller('/questions/:questionId/comments')
@ApiBearerAuth()
export class CommentOnQuestionController {
  constructor(private commentOnQuestion: CommentOnQuestionUseCase) {}

  @Post()
  async handle(
    @Body() body: CommentOnQuestionDTO,
    @CurrentUser() user: UserPayload,
    @Param('questionId') questionId: string,
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.commentOnQuestion.execute({
      content,
      questionId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
