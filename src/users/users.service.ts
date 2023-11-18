import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import mongoose, { Model, Types, mongo } from 'mongoose';
import { PurchasedItem } from 'src/schemas/purchased-item.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(PurchasedItem.name)
    private purchasedItemModel: Model<PurchasedItem>,
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

  async remove(id: string) {
    await this.userModel.deleteOne({ _id: new Types.ObjectId(id) }).exec();
  }
}
