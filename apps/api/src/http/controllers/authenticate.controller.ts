import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { createZodDto } from 'nestjs-zod';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

const authenticateBodySchema = z.object({
  email: z.email(),
  password: z.string(),
});

class AuthenticateDTO extends createZodDto(authenticateBodySchema) {}

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  @Post()
  async handle(@Body() body: AuthenticateDTO) {
    const { email, password } = body;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User credentials do not match.');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('User credentials do not match.');
    }

    const accessToken = this.jwt.sign({ sub: user.id });

    return {
      accessToken,
    };
  }
}
