import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class ProbabilityModel {
  @Prop({
    required: true,
    type: String,
  })
  public _id: string;

  @Prop({
    required: true,
    type: Date,
  })
  date: Date;

  @Prop({
    required: true,
    type: Array<Games>,
  })
  games: Array<Games>;
}

export type ProbabilityDocument = ProbabilityModel & Document;
export const ProbabilitySchema = SchemaFactory.createForClass(ProbabilityModel);

export interface Games {
  home;
  away;
  btts;
  over_2_5;
  under_2_5;
  over_3_5;
  under_3_5;
  one;
  x;
  two;
}
