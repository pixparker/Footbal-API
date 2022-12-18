import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class SampleOwnerModel {
  @Prop()
  name: string;
}

export type SampleOwnerDocument = SampleOwnerModel & Document;
export const SampleOwnerSchema = SchemaFactory.createForClass(SampleOwnerModel);
