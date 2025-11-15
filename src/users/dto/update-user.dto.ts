import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

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
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
  password?: string;
}
