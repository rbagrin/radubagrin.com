import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Stock extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  ticker: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const StockSchema = SchemaFactory.createForClass(Stock);
