import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { TrailService } from './trail.service';
import { CreateTrailDto } from './dto/create-trail.dto';
import { UpdateTrailDto } from './dto/update-trail.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import type { User } from '@prisma/client';
import { GetTrailsDto } from './dto/get-trails.dto';

@ApiTags('trail')
@Controller('trail')
export class TrailController {
  constructor(private readonly trailService: TrailService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar uma nova trilha de estudo' })
  @ApiResponse({ status: 201, description: 'Trilha criada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  create(@Body() createTrailDto: CreateTrailDto, @GetUser() user: User) {
    return this.trailService.create(createTrailDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as trilhas' })
  @ApiResponse({ status: 200, description: 'Lista de trilhas.' })
  findAll(@Query() dto: GetTrailsDto) {
    return this.trailService.findAll(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma trilha por ID (com posts ordenados)' })
  @ApiResponse({ status: 200, description: 'Trilha encontrada.' })
  @ApiResponse({ status: 404, description: 'Trilha não encontrada.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.trailService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar uma trilha (título, descrição ou posts)',
  })
  @ApiResponse({ status: 200, description: 'Trilha atualizada com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  @ApiResponse({ status: 404, description: 'Trilha não encontrada.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTrailDto: UpdateTrailDto,
    @GetUser() user: User,
  ) {
    return this.trailService.update(id, updateTrailDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar uma trilha' })
  @ApiResponse({ status: 200, description: 'Trilha deletada com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  @ApiResponse({ status: 404, description: 'Trilha não encontrada.' })
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.trailService.remove(id, user);
  }
}
