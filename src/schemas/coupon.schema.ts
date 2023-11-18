import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CouponDocument = HydratedDocument<Coupon>;

@Schema({ timestamps: true })
export class Coupon {
  @Prop({ required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  discountPrice: number;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);

CouponSchema.index({ userId: 'asc' });
