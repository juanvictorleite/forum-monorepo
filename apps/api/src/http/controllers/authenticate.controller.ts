import { AuthenticateStudentUseCase } from '@forum/domain';
import { Body, Controller, Post } from '@nestjs/common';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const authenticateBodySchema = z.object({
  email: z.email(),
  password: z.string(),
});

class AuthenticateDTO extends createZodDto(authenticateBodySchema) {}

@Controller('/sessions')
export class AuthenticateController {
  constructor(private authenticateStudentUseCase: AuthenticateStudentUseCase) {}

  @Post()
  async handle(@Body() body: AuthenticateDTO) {
    const { email, password } = body;

    const result = await this.authenticateStudentUseCase.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      throw new Error();
    }

    const { accessToken } = result.value;

    return {
      accessToken,
    };
  }
}
