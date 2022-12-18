import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class PredictionModel {
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
    type: Array<Predictions>,
  })
  predictions: Array<Predictions>;
}

export type PredictionDocument = PredictionModel & Document;
export const PredictionSchema = SchemaFactory.createForClass(PredictionModel);

export interface Predictions {
  fixtureId: number,
  country_league: string;
  home: string;
  away: string;
  home_away: string;
  under_over: string;
  advice: string;
  goals;
  match_winner;
  goals_over_under;
  goals_over_under_first_half;
  double_chance;
  both_teams_score;
}
