import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { PointsController } from './points.controller';
import { BullModule } from '@nestjs/bull';
import { PointProcessor } from './points.processor';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    BullModule.registerQueue({
      name: 'point',
    }),
    UsersModule,
  ],
  controllers: [PointsController],
  providers: [PointProcessor],
})
export class PointsModule {}
