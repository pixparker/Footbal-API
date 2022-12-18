import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: false,
})
export class OnePredictionModel {
  @Prop({
    type: String,
  })
  country_league: string;

  @Prop({
    type: String,
  })
  home: string;

  @Prop({
    type: String,
  })
  away: string;

  @Prop({
    type: String,
  })
  under_over: any;

  @Prop({
    type: String,
  })
  advice: string;
}

export type OnePredictionDocument = OnePredictionModel & Document;
export const OnePredictionSchema =
  SchemaFactory.createForClass(OnePredictionModel);
