import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: false,
})
export class MatchDataModel {
  @Prop({
    type: String,
  })
  _id: string;

  @Prop({
    type: Date,
  })
  date: Date;

  @Prop({
    type: Array<MatchData>,
  })
  predictions: Array<MatchData>;
}

export type MatchDataDocument = MatchDataModel & Document;
export const MatchDataSchema = SchemaFactory.createForClass(MatchDataModel);

export interface MatchData {
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
