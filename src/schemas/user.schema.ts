import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop({ default: () => Math.floor(100000 + Math.random() * 900000) })
  otpCode: string;

  @Prop({ default: 0 })
  points: number;

  @Prop()
  purchaseHistory: Array<any>;

  @Prop()
  availableCoupons: Array<any>;

  @Prop()
  verified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ phoneNumber: 'asc' });
