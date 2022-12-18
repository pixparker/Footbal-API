import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class OddModel {
  @Prop({
    required: true,
    type: String,
  })
  _id: string;

  @Prop({
    type: Date,
  })
  date: Date;

  @Prop({
    type: Array<Odds>,
  })
  odds: Array<Odds>;
}

export type OddDocument = OddModel & Document;
export const OddSchema = SchemaFactory.createForClass(OddModel);

export interface Odds {
  fixtureId,
  home: string;
  away: string;
  home_away: string;
  match_winner;
  goals_over_under;
  goals_over_under_first_half;
  double_chance;
  both_teams_score;
}
