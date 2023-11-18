import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import mongoose, { Model, Types, mongo } from 'mongoose';
import { PurchasedItem } from 'src/schemas/purchased-item.schema';
import { Coupon } from 'src/schemas/coupon.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(PurchasedItem.name)
    private purchasedItemModel: Model<PurchasedItem>,
    @InjectModel(Coupon.name) private couponModel: Model<Coupon>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({
      phoneNumber: createUserDto.phoneNumber,
    });
    if (existingUser) {
      existingUser;
    }
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  findAll() {
    return this.userModel.find().exec();
  }

  findOne(filter) {
    return this.userModel.findOne(filter).exec();
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel
      .updateOne({ _id: new Types.ObjectId(id) }, updateUserDto)
      .exec();
  }

  getPurchasedItems(id: string) {
    return this.purchasedItemModel
      .find({
        userId: new mongoose.Types.ObjectId(id),
      })
      .exec();
  }

  async getTotalPoints(id: string) {
    const user = await this.userModel.findById(
      new mongoose.Types.ObjectId(id),
      'points',
    );
    return user.points;
  }

  addPoint(id: string, points: number) {
    return this.userModel.updateOne(
      { _id: new Types.ObjectId(id) },
      {
        $inc: {
          points: points,
        },
      },
    );
  }

  async exchangePoints(id: string, points: number) {
    const user = await this.userModel.findById(new mongoose.Types.ObjectId(id));
    if (user.points >= points) {
      const pointsToExchange = points - (points % 5); // $5, $10, $15, ..., $50 coupons
      const createdCoupon = await this.couponModel.create({
        userId: user._id,
        discountPrice: pointsToExchange / 10,
      });
      await this.userModel.updateOne(
        { _id: user._id },
        {
          $inc: { points: -pointsToExchange },
        },
      );
      return createdCoupon;
    } else {
      throw ForbiddenException;
    }
  }

  async getCoupons(id: string) {
    return this.couponModel.find({ userId: new mongoose.Types.ObjectId(id) });
  }

  async remove(id: string) {
    await this.userModel.deleteOne({ _id: new Types.ObjectId(id) }).exec();
  }
}
