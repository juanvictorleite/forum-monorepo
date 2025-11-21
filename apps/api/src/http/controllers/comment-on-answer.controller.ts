import { CommentOnAnswerUseCase } from '@forum/domain';
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

const commentOnAnswerBodySchema = z.object({
  content: z.string(),
});

class CommentOnAnswerDTO extends createZodDto(commentOnAnswerBodySchema) {}

@Controller('/answers/:answerId/comments')
@ApiBearerAuth()
export class CommentOnAnswerController {
  constructor(private commentOnAnswer: CommentOnAnswerUseCase) {}

  @Post()
  async handle(
    @Body() body: CommentOnAnswerDTO,
    @CurrentUser() user: UserPayload,
    @Param('answerId') answerId: string,
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.commentOnAnswer.execute({
      content,
      answerId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
