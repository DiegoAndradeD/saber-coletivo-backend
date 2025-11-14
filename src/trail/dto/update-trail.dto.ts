import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class UpdateTrailDto {
  @ApiPropertyOptional({ example: 'Guia Completo de Finanças Pessoais' })
  @IsOptional()
  @IsString()
  @MinLength(5)
  title?: string;

  @ApiPropertyOptional({
    example: 'Um guia de finanças, do básico ao avançado.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: ['uuid-do-post-3', 'uuid-do-post-1'],
    description: 'Array de IDs de posts, NA ORDEM desejada.',
  })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  postIds?: string[];
}
