import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from 'src/prisma/dto/pagination.dto';

export class GetTrailsDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Busca por título ou descrição' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'id do criador' })
  @IsString()
  @IsUUID()
  @IsOptional()
  creatorId?: string;

  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
    description: 'Ordenação por data de criação',
  })
  @IsString()
  @IsOptional()
  sort?: 'asc' | 'desc';
}
