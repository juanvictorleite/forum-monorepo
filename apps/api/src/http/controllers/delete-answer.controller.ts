import { DeleteAnswerUseCase } from '@forum/domain';
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

@Controller('/answers/:id')
@ApiBearerAuth()
export class DeleteAnswerController {
  constructor(private deleteAnswer: DeleteAnswerUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') answerId: string,
  ) {
    const userId = user.sub;

    const result = await this.deleteAnswer.execute({
      answerId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
