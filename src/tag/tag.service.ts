import { Injectable } from '@nestjs/common';
import { TagRepository } from './tag.repository';

@Injectable()
export class TagService {
  constructor(private tagRepository: TagRepository) {}

  async findAll(page?: number, pageSize?: number) {
    return this.tagRepository.findAllPaginated(page, pageSize);
  }

  async findPostsByTagName(tagName: string) {
    return this.tagRepository.findPostsByTagName(tagName);
  }
}
