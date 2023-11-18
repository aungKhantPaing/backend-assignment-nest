import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { AddPointDto } from './dto/add-point.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { CalculatePointDto } from './dto/calculate-point.dto';

@Processor('point')
export class PointProcessor {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  @Process('calculate-point')
  async calculatePoint(job: Job<CalculatePointDto>) {
    console.log('calculate-point');
    let totalAmount = 0;
    // let progress = 0;
    const purchasedItems = job.data.purchasedItems;
    const nItem = purchasedItems.length;

    for (let i = 0; i < nItem; i++) {
      const item = purchasedItems[i];
      if (item.isNonAlchohol) {
        totalAmount += item.price;
      }
      // progress = ((progress + 1) / nItem) * 100;
      // await job.progress(progress);
    }

    return totalAmount / 10;
  }

  @Process('add-point')
  async addPoint(job: Job<AddPointDto>) {
    const updateResult = await this.userModel.updateOne(
      { _id: new Types.ObjectId(job.data.memberCode) },
      {
        $inc: {
          points: job.data.points,
        },
      },
      { new: true },
    );
    return updateResult;
  }
}
