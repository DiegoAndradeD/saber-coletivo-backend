import { Module } from '@nestjs/common';
import { TrailService } from './trail.service';
import { TrailController } from './trail.controller';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TrailRepository } from './trail.repository';

@Module({
  imports: [PrismaModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [TrailService, TrailRepository],
  controllers: [TrailController],
})
export class TrailModule {}
