/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthRepository {
  constructor(
    private prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async create(dto: CreateUserDto): Promise<any> {
    const passwordHashed = await bcrypt.hash(dto.password, 10);
    const data = {
      ...dto,
      password: passwordHashed,
    };
    const user = await this.prisma.user.create({ data });
    const { password, ...userWithoutPassword } = user;
    const token = await this.generateToken(userWithoutPassword);
    return {
      ...userWithoutPassword,
      token,
    };
  }

  async validateUser(dto: LoginUserDto): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Senha inválida');
    }

    const { password, ...userWithoutPassword } = user;
    const token = await this.generateToken(userWithoutPassword);
    return { ...userWithoutPassword, token };
  }

  async generateToken(user: any): Promise<string> {
    const payload = { sub: user.id, email: user.email };
    return this.jwt.signAsync(payload);
  }
}
