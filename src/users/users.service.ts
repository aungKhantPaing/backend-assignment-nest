import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  create(createUserDto: CreateUserDto) {
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

  async remove(id: string) {
    await this.userModel.deleteOne({ _id: new Types.ObjectId(id) }).exec();
  }
}
