import { Controller, Get, Param } from '@nestjs/common';
import { TagService } from './tag.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('tag')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as tags' })
  @ApiResponse({ status: 200, description: 'Lista de todas as tags únicas.' })
  findAll() {
    return this.tagService.findAll();
  }

  @Get(':name/posts')
  @ApiOperation({ summary: 'Listar posts por uma tag específica' })
  @ApiResponse({ status: 200, description: 'Lista de posts da tag.' })
  @ApiResponse({ status: 404, description: 'Tag não encontrada.' })
  findPostsByTagName(@Param('name') name: string) {
    return this.tagService.findPostsByTagName(name);
  }
}
