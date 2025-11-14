import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'Como fazer um currículo' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'O primeiro passo é...' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: ['currículo', 'emprego', 'finanças'] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
