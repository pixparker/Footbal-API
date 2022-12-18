import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SampleOwnerModel } from '.';
import { v4 as uuid } from 'uuid';
import * as mongoose from 'mongoose';

export const sampleSchemaName = 'sample-docs';

@Schema({
  timestamps: true,
})
export class SampleModel {
  @Prop({
    default: uuid,
    required: true,
    type: String,
  })
  public _id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  age: number;

  @Prop()
  isAvailable: boolean;

  @Prop([String])
  implecitType: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'SampleOwnerModel' })
  owner: SampleOwnerModel;

  // sample of multiple owner
  /*
  @Prop({type: [mongoose.Schema.Types.ObjectId, ref:'SampleOwnerModel']})
  owners: SampleOwnerModel[];
  */

  // sample of raw definition
  @Prop(
    raw({
      firstName: { type: String },
      lastName: { type: String },
    }),
  )
  details: Record<string, any>;
}

export type SampleDocument = SampleModel & Document;
export const SampleSchema = SchemaFactory.createForClass(SampleModel);
