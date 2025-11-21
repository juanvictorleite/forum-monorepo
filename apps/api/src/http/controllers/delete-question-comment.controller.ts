import { DeleteQuestionCommentUseCase } from '@forum/domain';
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { type UserPayload } from 'src/auth/jwt.strategy';

@Controller('/questions/comments/:id')
@ApiBearerAuth()
export class DeleteQuestionCommentController {
  constructor(private deleteQuestionComment: DeleteQuestionCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') questionCommentId: string,
  ) {
    const userId = user.sub;

    const result = await this.deleteQuestionComment.execute({
      questionCommentId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
