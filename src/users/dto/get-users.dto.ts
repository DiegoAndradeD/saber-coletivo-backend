import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/prisma/dto/pagination.dto';

export class GetUsersDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Buscar por nome de usuário' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
    description: 'Ordenar por data de criação',
  })
  @IsString()
  @IsOptional()
  sort?: 'asc' | 'desc';
}
