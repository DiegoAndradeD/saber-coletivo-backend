import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @ApiPropertyOptional({ example: 'Como fazer um bom currículo' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'O primeiro passo é focar...' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ example: ['curriculo', 'carreira'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
