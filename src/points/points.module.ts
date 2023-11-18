import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { PointsController } from './points.controller';
import { BullModule } from '@nestjs/bull';
import { PointProcessor } from './points.processor';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    BullModule.registerQueue({
      name: 'point',
    }),
  ],
  controllers: [PointsController],
  providers: [PointProcessor],
})
export class PointsModule {}
