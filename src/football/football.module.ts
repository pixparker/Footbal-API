import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FootballController } from './football.controller';
import { FootballService } from './football.service';
import { MatchDataSchema, OddSchema, PredictionSchema, ProbabilitySchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'prediction', schema: PredictionSchema },
      { name: 'probability', schema: ProbabilitySchema },
      { name: 'odd', schema: OddSchema },
      { name: 'matchData', schema: MatchDataSchema },
    ]),
  ],
  controllers: [FootballController],
  providers: [FootballService],
})
export class FootballModule {}
