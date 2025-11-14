import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: 'dasnujidabsidbasibdjiasbdnas',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, AuthRepository],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
