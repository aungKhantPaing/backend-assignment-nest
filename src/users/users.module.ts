import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';

import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import {
  PurchasedItem,
  PurchasedItemSchema,
} from 'src/schemas/purchased-item.schema';
import { Coupon, CouponSchema } from 'src/schemas/coupon.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: PurchasedItem.name, schema: PurchasedItemSchema },
      { name: Coupon.name, schema: CouponSchema },
    ]),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      // Store-specific configuration:
      host: 'localhost',
      port: 6379,
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
