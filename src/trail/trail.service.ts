import { Injectable } from '@nestjs/common';
import { TrailRepository } from './trail.repository';
import { CreateTrailDto } from './dto/create-trail.dto';
import { UpdateTrailDto } from './dto/update-trail.dto';
import { User } from '@prisma/client';
import { GetTrailsDto } from './dto/get-trails.dto';

@Injectable()
export class TrailService {
  constructor(private trailRepository: TrailRepository) {}

  create(createTrailDto: CreateTrailDto, user: User) {
    return this.trailRepository.create(createTrailDto, user.id);
  }

  findAll(dto: GetTrailsDto) {
    return this.trailRepository.findAll(dto);
  }

  findOne(id: string) {
    return this.trailRepository.findOne(id);
  }

  update(id: string, updateTrailDto: UpdateTrailDto, user: User) {
    return this.trailRepository.update(id, updateTrailDto, user.id);
  }

  remove(id: string, user: User) {
    return this.trailRepository.remove(id, user.id);
  }
}
