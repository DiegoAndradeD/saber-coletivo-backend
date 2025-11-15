import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'Como fazer um currículo' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'O primeiro passo é...' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ example: 'Um breve resumo do post.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: ['currículo', 'emprego', 'finanças'] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
