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
        authorId: authorId,
        tags: tagData,
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        tags: true,
      },
    });
  }

  async findAll() {
    return this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, name: true } },
        tags: true,
      },
    });
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
