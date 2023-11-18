import { Body, Controller, Get, Patch } from '@nestjs/common';
import { AddPointDto } from './dto/add-point.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CalculatePointDto } from './dto/calculate-point.dto';

@Controller('points')
export class PointsController {
  constructor(@InjectQueue('point') private readonly pointQueue: Queue) {}

  @Get('calculate')
  async calculate(@Body() calculatePointDto: CalculatePointDto) {
    console.log('points/calculate', calculatePointDto);
    const job = await this.pointQueue.add('calculate-point', calculatePointDto);
    const result = await job.finished();
    return result;
  }

  @Patch('add')
  async add(@Body() addPointDto: AddPointDto) {
    const job = await this.pointQueue.add('add-point', addPointDto);
    const result = await job.finished();
    return result;
  }
}
