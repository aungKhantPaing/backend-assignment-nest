import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Inject,
  UseInterceptors,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Types } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import QRCode from 'qrcode';
import { PurchasedItemDocument } from 'src/schemas/purchased-item.schema';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CouponDocument } from 'src/schemas/coupon.schema';
import { ExchangePointsDto } from './dto/exchange-points.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({ _id: new Types.ObjectId(id) });
  }

  @Get('qr')
  getQr(@Request() req) {
    return QRCode.toString(`${req.user._id}`);
  }

  @Get('purchased-items')
  getPurchasedItems(@Request() req): Promise<PurchasedItemDocument[]> {
    return this.usersService.getPurchasedItems(req.user._id);
  }

  @UseInterceptors(CacheInterceptor)
  @Get('total-points')
  getTotalPoints(@Request() req): Promise<number> {
    return this.usersService.getTotalPoints(req.user._id);
  }

  @Post('exchange-points')
  exchangePoints(
    @Request() req,
    @Body() exchangePointsDto: ExchangePointsDto,
  ): Promise<CouponDocument> {
    return this.usersService.exchangePoints(
      req.user._id,
      exchangePointsDto.points,
    );
  }

  @Get('coupons')
  async getCoupons(@Request() req) {
    const coupons = await this.usersService.getCoupons(req.user._id);
    return {
      coupons,
      quantity: coupons.length,
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
