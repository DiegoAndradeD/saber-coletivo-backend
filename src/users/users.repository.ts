/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { paginate, PaginatedResult } from 'src/prisma/utils/paginate';
import { User } from '@prisma/client';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

export type PublicUserProfile = Pick<User, 'id' | 'name' | 'createdAt'>;

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(
    dto: GetUsersDto = {},
  ): Promise<PaginatedResult<PublicUserProfile>> {
    const { search, sort, page, pageSize } = dto;

    const where: any = {};

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const orderBy = { createdAt: sort || 'desc' };

    const result = await paginate(
      this.prisma.user,
      { page, pageSize },
      where,
      {},
      orderBy,
    );

    const items: PublicUserProfile[] = result.items.map((user) => ({
      id: user.id,
      name: user.name,
      createdAt: user.createdAt,
    }));

    return {
      ...result,
      items,
    };
  }

  async findOne(id: string): Promise<PublicUserProfile> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const data: any = {
      name: dto.name,
    };

    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return updatedUser;
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    try {
      await this.prisma.user.delete({ where: { id } });
      return { message: 'Usuário deletado com sucesso' };
    } catch (error) {
      if (error.code === 'P2003') {
        throw new ForbiddenException(
          'Não é possível deletar o usuário. Reatribua ou delete os posts e trilhas associados primeiro.',
        );
      }
      throw error;
    }
  }

  async findMostActiveAuthorsPaginated(page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;

    const authors = await this.prisma.$queryRaw<
      { id: string; name: string; postCount: bigint }[]
    >`
    SELECT
      u.id,
      u.name,
      COUNT(p.id) AS "postCount"
    FROM "User" u
    LEFT JOIN "Post" p ON p."authorId" = u.id
    GROUP BY u.id, u.name
    ORDER BY "postCount" DESC
    LIMIT ${pageSize} OFFSET ${offset};
  `;

    const total = await this.prisma.user.count();

    return {
      items: authors.map((a) => ({ ...a, postCount: Number(a.postCount) })),
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
