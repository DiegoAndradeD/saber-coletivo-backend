import { Injectable } from '@nestjs/common';
import { TagRepository } from './tag.repository';

@Injectable()
export class TagService {
  constructor(private tagRepository: TagRepository) {}

  async findAll() {
    return this.tagRepository.findAll();
  }

  async findPostsByTagName(tagName: string) {
    return this.tagRepository.findPostsByTagName(tagName);
  }
}
