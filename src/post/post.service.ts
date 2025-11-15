import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '@prisma/client';
import { GetPostsDto } from './dto/get-posts.dto';

@Injectable()
export class PostService {
  constructor(private postRepository: PostRepository) {}

  async create(createPostDto: CreatePostDto, user: User) {
    return this.postRepository.create(createPostDto, user.id);
  }

  async findAll(dto: GetPostsDto) {
    return this.postRepository.findAll(dto);
  }

  async findOne(id: string) {
    return this.postRepository.findOne(id);
  }

  async update(id: string, updatePostDto: UpdatePostDto, user: User) {
    return this.postRepository.update(id, updatePostDto, user.id);
  }

  async remove(id: string, user: User) {
    return this.postRepository.remove(id, user.id);
  }
}
