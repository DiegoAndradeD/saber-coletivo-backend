import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TagRepository {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.tag.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findPostsByTagName(tagName: string) {
    const normalizedName = tagName.trim().toLowerCase();

    const tagWithPosts = await this.prisma.tag.findUnique({
      where: { name: normalizedName },
      include: {
        posts: {
          orderBy: { createdAt: 'desc' },
          include: {
            author: { select: { id: true, name: true } },
            tags: true,
          },
        },
      },
    });

    if (!tagWithPosts) {
      throw new NotFoundException(`Tag "${tagName}" não encontrada.`);
    }

    return tagWithPosts;
  }
}
