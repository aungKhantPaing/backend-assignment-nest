import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop()
  otpCode: string;

  @Prop({ default: 0 })
  points: number;

  @Prop()
  purchaseHistory: Array<any>;

  @Prop()
  availableCoupons: Array<any>;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ phoneNumber: 'asc' });
