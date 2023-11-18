import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { PointsModule } from './points/points.module';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { LocalAPIKeyAuthGuard } from './auth/localapikey-auth.guard';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/codico'),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    UsersModule,
    PointsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: LocalAPIKeyAuthGuard,
    },
    AppService,
  ],
})
export class AppModule {}
