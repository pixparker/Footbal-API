import * as dotenv from 'dotenv';
import { EnvironmentDto } from '.';

dotenv.config();
const env: NodeJS.ProcessEnv = process.env;

export const environment: EnvironmentDto = {
  port: parseInt(env.PORT),
  sampleConfig: env.SAMPLE_CONFIG,
  sampleIntegerConfig: parseInt(env.SAMPLE_INTEGER_CONFIG),
  sampleBooleanConfig:
    env.SAMPLE_BOOLEAN_CONFIG?.toUpperCase() == 'TRUE' ? true : false,
  mongoUrl: env.MONGO_URL,
  jwtSecret: env.JWT_SECRET,
  rapidApiToken: env.RAPID_API_TOKEN,
  monkApiKey: env.MONK_API_KEY,
};

console.log('env', environment);
