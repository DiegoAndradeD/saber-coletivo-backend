import { Controller, Get, Param, Query } from '@nestjs/common';
import { TagService } from './tag.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetTagsDto } from './dto/get-tags.dto';

@ApiTags('tag')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as tags de forma paginada' })
  @ApiResponse({ status: 200, description: 'Lista de tags com paginação.' })
  findAll(@Query() dto: GetTagsDto) {
    return this.tagService.findAll(Number(dto.page), Number(dto.pageSize));
  }

  @Get(':name/posts')
  @ApiOperation({ summary: 'Listar posts por uma tag específica' })
  @ApiResponse({ status: 200, description: 'Lista de posts da tag.' })
  @ApiResponse({ status: 404, description: 'Tag não encontrada.' })
  findPostsByTagName(@Param('name') name: string) {
    return this.tagService.findPostsByTagName(name);
  }
}
