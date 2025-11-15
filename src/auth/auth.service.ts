/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthRepository } from './auth.repository';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async register(createUserDto: CreateUserDto) {
    return this.authRepository.create(createUserDto);
  }

  async login(loginUserDto: LoginUserDto) {
    return this.authRepository.validateUser(loginUserDto);
  }

  async me(user: User, token: string) {
    return this.authRepository.me(user.id, token);
  }
}
