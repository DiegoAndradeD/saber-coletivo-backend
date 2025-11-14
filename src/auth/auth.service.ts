/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthRepository } from './auth.repository';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async register(createUserDto: CreateUserDto) {
    return this.authRepository.create(createUserDto);
  }

  async login(loginUserDto: LoginUserDto) {
    return this.authRepository.validateUser(loginUserDto);
  }
}
