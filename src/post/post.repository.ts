/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { paginate, PaginatedResult } from 'src/prisma/utils/paginate';
import { Post } from '@prisma/client';
import { GetPostsDto } from './dto/get-posts.dto';

@Injectable()
export class PostRepository {
  constructor(private prisma: PrismaService) {}

  private normalizeTags(tags: string[]) {
    return tags.map((name) => name.trim().toLowerCase());
  }

  private mapTagsForPrisma(tags: string[]) {
    const normalizedTags = this.normalizeTags(tags);
    return {
      connectOrCreate: normalizedTags.map((tagName) => ({
        where: { name: tagName },
        create: { name: tagName },
      })),
    };
  }

  async create(dto: CreatePostDto, authorId: string) {
    const tagData = this.mapTagsForPrisma(dto.tags);

    return this.prisma.post.create({
      data: {
        title: dto.title,
        content: dto.content,
        description: dto.description,
        authorId: authorId,
        tags: tagData,
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        tags: true,
      },
    });
  }

  async findAll(dto: GetPostsDto = {}): Promise<PaginatedResult<Post>> {
    const { search, authorId, tags, trailId, sort } = dto;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (authorId) {
      where.authorId = authorId;
    }

    if (tags) {
      where.tags = {
        some: {
          id: { in: tags },
        },
      };
    }

    if (trailId) {
      where.postsOnTrails = {
        some: {
          trailId,
        },
      };
    }

    const orderBy = { createdAt: sort || 'desc' };

    return paginate(
      this.prisma.post,
      { page: dto.page, pageSize: dto.pageSize },
      where,
      {
        author: { select: { id: true, name: true } },
        tags: true,
        postsOnTrails: { include: { trail: true } },
      },
      orderBy,
    );
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true } },
        tags: true,
      },
    });

    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }
    return post;
  }

  async update(id: string, dto: UpdatePostDto, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException(
        'Acesso negado: Você não é o autor deste post',
      );
    }

    const data: any = {
      title: dto.title,
      content: dto.content,
      description: dto.description,
    };

    if (dto.tags) {
      data.tags = this.mapTagsForPrisma(dto.tags);
    }

    return this.prisma.post.update({
      where: { id },
      data,
      include: {
        author: { select: { id: true, name: true, email: true } },
        tags: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException(
        'Acesso negado: Você não é o autor deste post',
      );
    }

    await this.prisma.post.delete({ where: { id } });
    return { message: 'Post deletado com sucesso' };
  }
}
