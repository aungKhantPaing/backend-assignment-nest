import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type PurchasedItemDocument = HydratedDocument<PurchasedItem>;

@Schema()
export class PurchasedItem {
  @Prop({ required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop()
  name: string;

  @Prop({ default: false })
  isNonAlcohol: boolean;

  @Prop({ required: true })
  price: number;

  @Prop()
  purchasedAt: Date;
}

export const PurchasedItemSchema = SchemaFactory.createForClass(PurchasedItem);

PurchasedItemSchema.index({ userId: 'asc' });
