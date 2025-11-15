/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDto } from 'src/prisma/dto/pagination.dto';

export class GetPostsDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'id do autor' })
  @IsString()
  @IsUUID()
  @IsOptional()
  authorId?: string;

  @ApiPropertyOptional({
    isArray: true,
    type: String,
    description: 'tags separadas por vírgula',
  })
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  tags?: string[];

  @ApiPropertyOptional({ description: 'id da trilha' })
  @IsString()
  @IsUUID()
  @IsOptional()
  trailId?: string;

  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  @IsString()
  @IsOptional()
  sort?: 'asc' | 'desc';
}
