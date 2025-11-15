import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { paginate } from 'src/prisma/utils/paginate';

@Injectable()
export class TagRepository {
  constructor(private prisma: PrismaService) {}

  async findAllPaginated(page = 1, pageSize = 10) {
    return paginate(
      this.prisma.tag,
      { page, pageSize },
      {},
      {},
      { name: 'asc' },
    );
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
