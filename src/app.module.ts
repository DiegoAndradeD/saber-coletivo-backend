import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { TagModule } from './tag/tag.module';
import { TrailModule } from './trail/trail.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    AuthModule,
    PostModule,
    TagModule,
    TrailModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
