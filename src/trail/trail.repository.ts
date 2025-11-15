/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTrailDto } from './dto/create-trail.dto';
import { UpdateTrailDto } from './dto/update-trail.dto';
import { GetTrailsDto } from './dto/get-trails.dto';
import { paginate, PaginatedResult } from 'src/prisma/utils/paginate';
import { Prisma, Trail } from '@prisma/client';

@Injectable()
export class TrailRepository {
  constructor(private prisma: PrismaService) {}

  private mapPostsForPrisma(postIds: string[]) {
    return postIds.map((id, index) => ({
      order: index + 1,
      post: { connect: { id } },
    }));
  }

  async create(dto: CreateTrailDto, creatorId: string) {
    const postData = this.mapPostsForPrisma(dto.postIds);

    return this.prisma.trail.create({
      data: {
        title: dto.title,
        description: dto.description,
        creatorId: creatorId,
        posts: {
          create: postData,
        },
      },
      include: {
        creator: { select: { id: true, name: true } },
        posts: {
          orderBy: { order: 'asc' },
          include: { post: true },
        },
      },
    });
  }

  async findAll(dto: GetTrailsDto): Promise<PaginatedResult<Trail>> {
    const { search, creatorId, sort } = dto;

    const where: Prisma.TrailWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (creatorId) {
      where.creatorId = creatorId;
    }
    const validSorts = ['asc', 'desc'] as const;

    const sortOrder: 'asc' | 'desc' = validSorts.includes(sort as any)
      ? (sort as 'asc' | 'desc')
      : 'desc';

    const orderBy: Prisma.TrailOrderByWithRelationInput = {
      createdAt: sortOrder,
    };

    return paginate(
      this.prisma.trail,
      { page: dto.page, pageSize: dto.pageSize },
      where,
      {
        creator: { select: { id: true, name: true } },
        _count: { select: { posts: true } },
      },
      orderBy,
    );
  }

  async findOne(id: string) {
    const trail = await this.prisma.trail.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true } },
        posts: {
          orderBy: { order: 'asc' },
          include: {
            post: {
              include: {
                author: true,
                tags: true,
              },
            },
          },
        },
      },
    });

    if (!trail) {
      throw new NotFoundException('Trilha não encontrada');
    }
    return trail;
  }

  async update(id: string, dto: UpdateTrailDto, userId: string) {
    const trail = await this.prisma.trail.findUnique({
      where: { id },
      select: { creatorId: true },
    });

    if (!trail) {
      throw new NotFoundException('Trilha não encontrada');
    }
    if (trail.creatorId !== userId) {
      throw new ForbiddenException(
        'Acesso negado: Você não é o criador desta trilha',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      if (dto.title || dto.description) {
        await tx.trail.update({
          where: { id },
          data: {
            title: dto.title,
            description: dto.description,
          },
        });
      }

      if (dto.postIds) {
        await tx.postsOnTrails.deleteMany({
          where: { trailId: id },
        });

        const postData = this.mapPostsForPrisma(dto.postIds);
        await tx.trail.update({
          where: { id },
          data: {
            posts: {
              create: postData,
            },
          },
        });
      }

      return this.findOne(id);
    });
  }

  async remove(id: string, userId: string) {
    const trail = await this.prisma.trail.findUnique({
      where: { id },
      select: { creatorId: true },
    });

    if (!trail) {
      throw new NotFoundException('Trilha não encontrada');
    }
    if (trail.creatorId !== userId) {
      throw new ForbiddenException(
        'Acesso negado: Você não é o criador desta trilha',
      );
    }

    await this.prisma.trail.delete({ where: { id } });
    return { message: 'Trilha deletada com sucesso' };
  }
}
