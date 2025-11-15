import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'Novo Nome de Usuário',
    description: 'Novo nome do usuário',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'novaSenhaForte123',
    description: 'Nova senha do usuário (mínimo 8 caracteres)',
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;
}
