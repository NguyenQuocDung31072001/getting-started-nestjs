import { PrismaService } from './../prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    try {
      const hash = await argon.hash(dto.password);
      const newUser = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      delete newUser.hash;
      return newUser;
    } catch (error) {
      console.log(error);
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }
  signin() {
    return { msg: 'this is sign in' };
  }
}
