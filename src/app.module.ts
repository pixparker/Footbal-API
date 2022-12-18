import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { environment } from './common/environments';
import { FootballModule } from './football/football.module';
import { SampleModule } from './sample-module/sample.module';

@Module({
  imports: [
    MongooseModule.forRoot(environment.mongoUrl),
    AuthModule,
    SampleModule,
    AuthModule,
    FootballModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
