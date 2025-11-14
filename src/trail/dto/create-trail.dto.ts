import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateTrailDto {
  @ApiProperty({ example: 'Introdução às Finanças Pessoais' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  title: string;

  @ApiProperty({ example: 'Uma trilha básica para organizar suas finanças.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: ['uuid-do-post-1', 'uuid-do-post-2'],
    description: 'Array de IDs de posts, NA ORDEM desejada.',
  })
  @IsArray()
  @IsUUID('all', { each: true })
  postIds: string[];
}
