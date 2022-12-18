/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Body, Controller, Get, Param, Query } from '@nestjs/common';
import { FootballService } from './football.service';

@Controller()
export class FootballController {
  constructor(private footballService: FootballService) {}

  @Get('prediction/find')
  async findLastPrediction() {
    return this.footballService.findLastPrediction();
  }

  @Get('prediction')
  async getFixtures(@Query('date') date: string) {
    return this.footballService.getFixtures(date);
  }

  @Get('probabilities')
  async getProbabilities(@Query('date') date: string) {
    return this.footballService.getProbabilities(date);
  }

  @Get('probabilities/find')
  async getLastProbability() {
    return this.footballService.getLastProbability();
  }

  @Get('odd')
  async getOddsByDate(@Query('date') date: string) {
    return this.footballService.getOddsByDate(date);
  }

  @Get('odd/find')
  async getLastOddsByDate() {
    return this.footballService.getLastOddsByDate();
  }

  @Get('livescore')
  async getLiveScore() {
    return this.footballService.getLiveScore();
  }

  @Get('match-data')
  async matchData() {
    return this.footballService.matchData();
  }
}
