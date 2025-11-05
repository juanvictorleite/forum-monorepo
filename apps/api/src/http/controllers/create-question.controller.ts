import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { type UserPayload } from 'src/auth/jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

class CreateQuestionDTO extends createZodDto(createQuestionBodySchema) {}

@Controller('/questions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body() body: CreateQuestionDTO,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, content } = body;
    const userId = user.sub;

    const slug = this.convertToSlug(title);

    await this.prisma.question.create({
      data: {
        authorId: userId,
        title,
        content,
        slug,
      },
    });
  }

  private convertToSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  }
}
