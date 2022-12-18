import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SampleController } from './sample.controller';
import { SampleService } from './sample.service';
import { SampleSchema, sampleSchemaName } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: sampleSchemaName, schema: SampleSchema },
    ]),
  ],
  controllers: [SampleController],
  providers: [SampleService],
})
export class SampleModule {}
