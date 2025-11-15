import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import type { User } from '@prisma/client';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('most-active')
  @ApiOperation({ summary: 'Listar autores com mais posts' })
  @ApiResponse({ status: 200, description: 'Lista de autores mais ativos.' })
  findMostActiveAuthors(@Query() dto: GetUsersDto) {
    return this.usersService.findMostActiveAuthorsPaginated(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários (perfis públicos)' })
  @ApiResponse({ status: 200, description: 'Lista de usuários.' })
  findAll(@Query() getUsersDto: GetUsersDto) {
    return this.usersService.findAll(getUsersDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um usuário por ID (perfil público)' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar o perfil do usuário logado' })
  @ApiResponse({ status: 200, description: 'Perfil atualizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  update(@Body() updateUserDto: UpdateUserDto, @GetUser() user: User) {
    return this.usersService.update(user.id, updateUserDto);
  }

  @Delete('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar a conta do usuário logado' })
  @ApiResponse({ status: 200, description: 'Conta deletada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  remove(@GetUser() user: User) {
    return this.usersService.remove(user.id);
  }
}
