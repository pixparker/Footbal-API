/* eslint-disable no-return-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { date, sleep, today } from '../common';
import { environment } from '../common/environments';
import {
  MatchDataDocument,
  OddDocument,
  PredictionDocument,
  ProbabilityDocument,
} from './schemas';

@Injectable()
export class FootballService {
  constructor(
    @InjectModel('prediction')
    private readonly predictionModel: Model<PredictionDocument>,
    @InjectModel('probability')
    private readonly probabilityModel: Model<ProbabilityDocument>,
    @InjectModel('odd')
    private readonly oddModel: Model<OddDocument>,
    @InjectModel('matchData')
    private readonly matchDataModel: Model<MatchDataDocument>,
  ) {}
  private logger = new Logger('FootBallService');

  async getFixtures(inputDate) {
    const date = inputDate || `${today.year}-${today.month}-${today.day}`;
    axios
      .request({
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
        params: { date: date },
        headers: {
          'X-RapidAPI-Key': environment.rapidApiToken,
          'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
        },
      })
      .then(async (response) => {
        this.logger.verbose('Start Collecting Predictions ...');
        const fixtureIds = [];
        response.data.response.forEach((data) => {
          fixtureIds.push({ id: data.fixture.id, goals: data.goals });
        });

        const predictions = [];
        let counter = 0;
        for (const fixture of fixtureIds) {
          await sleep(200);
          const prediction = await this.predictions(fixture.id, fixture.goals);
          predictions.push(prediction);

          process.stdout.write(
            `Please Wait ... ${counter + 1}/${fixtureIds.length}`,
          );
          process.stdout.cursorTo(0);
          counter += 1;
        }
        try {
          const finalPredictions = await this.predictionModel.create({
            _id: uuid(),
            date: date,
            predictions: predictions,
          });

          return finalPredictions;
        } catch (err) {
          this.logger.error(err);
        }
        this.logger.verbose('Collect Predictions Done!');
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async predictions(id: number, goals) {
    const req = axios.request({
      method: 'GET',
      url: 'https://api-football-v1.p.rapidapi.com/v3/predictions',
      params: { fixture: `${id}` },
      headers: {
        'X-RapidAPI-Key': environment.rapidApiToken,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
      },
    });

    const prediction = await req.then((response) => response.data.response);

    return {
      fixtureId: id,
      country_league: `${prediction[0].league.country} - ${prediction[0].league.name}`,
      home: prediction[0].teams.home.name,
      away: prediction[0].teams.away.name,
      home_away: `${prediction[0].teams.home.name} - ${prediction[0].teams.away.name}`,
      under_over: prediction[0].predictions.under_over,
      advice: prediction[0].predictions.advice,
      goals: goals,
      match_winner: { home: null, draw: null, away: null },
      goals_over_under: {
        U15: null,
        U25: null,
        U35: null,
        O15: null,
        O25: null,
        O35: null,
      },
      goals_over_under_first_half: null,
      double_chance: { AD: null, AH: null, DH: null },
      both_teams_score: { yes: null, no: null },
    };
  }

  async findLastPrediction() {
    const prediction = await this.predictionModel
      .findOne()
      .sort({ createdAt: -1 });

    if (!prediction) throw new NotFoundException();

    return prediction;
  }

  /////////////////////////////////////// SPORT MONKS ////////////////////////////////////

  async getMonkBookMakerId() {
    // usless
    const req = axios.get(
      `https://soccer.sportmonks.com/api/v2.0/bookmakers?api_token=${environment.monkApiKey}`,
      {
        headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
      },
    );

    const oneXBetId = await req
      .then((response) => {
        const oneXBet = response.data.data.find(
          (data) => data.name === '1xbet',
        );

        return oneXBet.id;
      })
      .catch((error) => {
        console.error(error);
      });

    return oneXBetId;
  }

  async getMonkFixturesId(inputDate) {
    const date = inputDate || `${today.year}-${today.month}-${today.day}`;
    const req = axios.get(
      `https://soccer.sportmonks.com/api/v2.0/fixtures/date/${date}?api_token=${environment.monkApiKey}`,
      {
        headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
      },
    );

    const fixtureIds = [];
    await req
      .then((res) => {
        res.data.data.forEach(async (fixture) => {
          fixtureIds.push({
            id: fixture.id,
            home: fixture.localteam_id,
            away: fixture.visitorteam_id,
          });
        });
      })
      .catch((error) => console.error(error));

    return fixtureIds;
  }

  async getTeam(id: number) {
    const req = axios.get(
      `https://soccer.sportmonks.com/api/v2.0/teams/${id}?api_token=${environment.monkApiKey}`,
      {
        headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
      },
    );

    const team = await req
      .then((res) => res.data.data.name)
      .catch((error) => console.error(error));

    return team;
  }

  async getProbabilitiesByFixtureId(id: number) {
    const req = axios.get(
      `https://soccer.sportmonks.com/api/v2.0/predictions/probabilities/fixture/${id}?api_token=${environment.monkApiKey}`,
      {
        headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
      },
    );

    const prob = await req
      .then((res) => {
        if (res.data.data.predictions !== undefined)
          return res.data.data.predictions;
      })
      .catch((error) => console.error(error));
    if (prob !== undefined)
      return {
        btts: prob.btts,
        over_2_5: prob.over_2_5,
        under_2_5: prob.under_2_5,
        over_3_5: prob.over_3_5,
        under_3_5: prob.under_3_5,
        home: prob.home,
        away: prob.away,
        draw: prob.draw,
      };
  }

  async getProbabilities(inputDate) {
    const date = inputDate || `${today.year}-${today.month}-${today.day}`;
    const fixtureIds = await this.getMonkFixturesId(date);
    const teams = [];
    let counter = 0;
    this.logger.verbose('Start Collecting Probabilies ...');
    for (const fixture of fixtureIds) {
      await sleep(100);
      const home = await this.getTeam(fixture.home);
      const away = await this.getTeam(fixture.away);
      const prediction = await this.getProbabilitiesByFixtureId(fixture.id);
      teams.push({
        home: home,
        away: away,
        btts: prediction.btts,
        over_2_5: prediction.over_2_5,
        under_2_5: prediction.under_2_5,
        over_3_5: prediction.over_3_5,
        under_3_5: prediction.under_3_5,
        one: prediction.home,
        x: prediction.draw,
        two: prediction.away,
      });
      process.stdout.write(
        `Please Wait ... ${counter + 1}/${fixtureIds.length}`,
      );
      process.stdout.cursorTo(0);
      counter += 1;
    }

    try {
      const probabilities = await this.probabilityModel.create({
        _id: uuid(),
        date: date,
        games: teams,
      });
      this.logger.verbose('Collect Probabilities Done!');

      return probabilities;
    } catch (error) {
      console.error(error);
    }
  }

  async getLastProbability() {
    const probability = await this.probabilityModel
      .findOne()
      .sort({ createdAt: -1 });

    if (!probability) throw new NotFoundException();

    return probability;
  }

  // odds in rappid API

  async getFixtureIds(date) {
    const fixtureReq = axios.request({
      method: 'GET',
      url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
      params: { date: date },
      headers: {
        'X-RapidAPI-Key': environment.rapidApiToken,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
      },
    });
    const fixtureIds: number[] = [];

    await fixtureReq
      .then((response) =>
        response.data.response.forEach((data) =>
          fixtureIds.push(data.fixture.id),
        ),
      )
      .catch((err) => console.error(err));

    return fixtureIds;
  }

  async findFixtureById(id: number) {
    const req = axios.request({
      method: 'GET',
      url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
      params: { id: `${id}` },
      headers: {
        'X-RapidAPI-Key': '846656e877msh8d704e64f9f1583p1383fbjsn005045dd9119',
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
      },
    });
    const teams = [];
    await req
      .then((res) =>
        teams.push({
          home: res.data.response[0].teams.home.name,
          away: res.data.response[0].teams.away.name,
        }),
      )
      .catch((err) => console.error(err));

    return teams[0];
  }

  async getOddsByDate(inputDate) {
    const date = inputDate || `${today.year}-${today.month}-${today.day}`;
    this.logger.verbose('Start Collecting Odds ...');
    const bookmaker = await this.getBookmakerId('1xBet');
    const oddsReq = axios.request({
      method: 'GET',
      url: 'https://api-football-v1.p.rapidapi.com/v3/odds',
      params: {
        date: date,
        bookmaker: `${bookmaker}`,
      },
      headers: {
        'X-RapidAPI-Key': '846656e877msh8d704e64f9f1583p1383fbjsn005045dd9119',
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
      },
    });

    const odds = await oddsReq
      .then((res) => res.data.response)
      .catch((error) => console.error(error));

    const oddListByFixture = [];
    for (const odd of odds) {
      const fixtureId = odd.fixture.id;
      const matchWinner = { home: null, draw: null, away: null };
      const goalsOverUnder = {
        U15: null,
        U25: null,
        U35: null,
        O15: null,
        O25: null,
        O35: null,
      };
      const doubleChance = { AD: null, AH: null, DH: null };
      const bothTeamsScore = { yes: null, no: null };
      let goalsOverUnderFirstHalf;
      for (const bet of odd.bookmakers[0].bets) {
        if (bet.name === 'Match Winner') {
          bet.values.forEach((d) => {
            if (d.value === 'Away') matchWinner.away = Number(d.odd);
            if (d.value === 'Draw') matchWinner.draw = Number(d.odd);
            if (d.value === 'Home') matchWinner.home = Number(d.odd);
          });
        }
        if (bet.name === 'Goals Over/Under') {
          bet.values.forEach((d) => {
            if (d.value === 'Under 1.5') goalsOverUnder.U15 = Number(d.odd);
            if (d.value === 'Under 2.5') goalsOverUnder.U25 = Number(d.odd);
            if (d.value === 'Under 3.5') goalsOverUnder.U35 = Number(d.odd);
            if (d.value === 'Over 1.5') goalsOverUnder.O15 = Number(d.odd);
            if (d.value === 'Over 2.5') goalsOverUnder.O25 = Number(d.odd);
            if (d.value === 'Over 3.5') goalsOverUnder.O35 = Number(d.odd);
          });
        }
        if (bet.name === 'Goals Over/Under First Half')
          goalsOverUnderFirstHalf = bet.values;
        if (bet.name === 'Double Chance') {
          bet.values.forEach((d) => {
            if (d.value === 'Away/Draw') doubleChance.AD = Number(d.odd);
            if (d.value === 'Away/Home') doubleChance.AH = Number(d.odd);
            if (d.value === 'Draw/Home') doubleChance.DH = Number(d.odd);
          });
        }
        if (bet.name === 'Both Teams Score') {
          bet.values.forEach((d) => {
            if (d.value === 'Yes') bothTeamsScore.yes = Number(d.odd);
            if (d.value === 'No') bothTeamsScore.no = Number(d.odd);
          });
        }
      }
      const teams = await this.findFixtureById(fixtureId);

      oddListByFixture.push({
        fixtureId: fixtureId,
        home: teams.home,
        away: teams.away,
        home_away: `${teams.home} - ${teams.away}`,
        match_winner: matchWinner,
        goals_over_under: goalsOverUnder,
        goals_over_under_first_half: goalsOverUnderFirstHalf,
        double_chance: doubleChance,
        both_teams_score: bothTeamsScore,
      });
    }

    try {
      const result = await this.oddModel.create({
        _id: uuid(),
        date: date,
        odds: oddListByFixture,
      });
      this.logger.verbose('Collect Odds Done!');

      return result;
    } catch (err) {
      console.error(err);
    }
  }

  async getLastOddsByDate() {
    const odd = await this.oddModel.findOne().sort({ createdAt: -1 });

    if (!odd) throw new NotFoundException();

    return odd;
  }

  async getBookmakerId(name: string) {
    const req = axios.request({
      method: 'GET',
      url: 'https://api-football-v1.p.rapidapi.com/v3/odds/bookmakers',
      headers: {
        'X-RapidAPI-Key': '846656e877msh8d704e64f9f1583p1383fbjsn005045dd9119',
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
      },
    });

    const bookmaker = await req
      .then((res) =>
        res.data.response.find((bookmaker) => bookmaker.name === name),
      )
      .catch((err) => console.error(err));

    return bookmaker.id;
  }

  async getLiveScore() {
    const lsReq = axios.request({
      method: 'GET',
      url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
      params: { live: 'all' },
      headers: {
        'X-RapidAPI-Key': '846656e877msh8d704e64f9f1583p1383fbjsn005045dd9119',
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
      },
    });

    const liveScores = [];

    await lsReq
      .then((res) =>
        res.data.response.forEach((data) =>
          liveScores.push({
            fixtureId: data.fixture.id,
            country_league: `${data.league.country} - ${data.league.name}`,
            home: data.teams.home.name,
            away: data.teams.away.name,
            goals: data.goals,
          }),
        ),
      )
      .catch((err) => console.error(err));

    return liveScores;
  }

  async matchData() {
    try {
      const odds = await this.getLastOddsByDate();
      const predictions = await this.findLastPrediction();
      const newObj = [];

      for (const prediction of predictions.predictions) {
        const matched = {
          fixtureId: null,
          country_league: null,
          home: null,
          away: null,
          home_away: null,
          under_over: null,
          advice: null,
          match_winner: null,
          goals_over_under: null,
          goals_over_under_first_half: null,
          double_chance: null,
          both_teams_score: null,
          goals: null,
        };
        for (const odd of odds.odds) {
          if (prediction.fixtureId === odd.fixtureId) {
            matched.fixtureId = odd.fixtureId;
            matched.country_league = prediction.country_league;
            matched.home = prediction.home;
            matched.away = prediction.away;
            matched.home_away = prediction.home_away;
            matched.under_over = prediction.under_over;
            matched.advice = prediction.advice;
            matched.match_winner = odd.match_winner;
            matched.goals_over_under = odd.goals_over_under;
            matched.goals_over_under_first_half =
              odd.goals_over_under_first_half;
            matched.double_chance = odd.double_chance;
            matched.both_teams_score = odd.both_teams_score;
            matched.goals = prediction.goals;
          }
        }
        if (prediction.fixtureId === matched.fixtureId) {
          newObj.push(matched);
        } else {
          newObj.push(prediction);
        }
      }

      const matchData = await this.matchDataModel.create({
        _id: uuid(),
        date: `${today.year}-${today.month}-${today.day}`,
        predictions: newObj,
      });

      return matchData;
    } catch (error) {
      console.error(error);
    }
  }
}
