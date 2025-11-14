import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTrailDto } from './dto/create-trail.dto';
import { UpdateTrailDto } from './dto/update-trail.dto';

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

  async findAll() {
    return this.prisma.trail.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        creator: { select: { id: true, name: true } },
        _count: { select: { posts: true } },
      },
    });
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
                author: { select: { id: true, name: true } },
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
