import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../../src/app.controller';
import { AppModule } from '../../../src/app.module';
import { AppService } from '../../../src/app.service';
import { SampleController } from '../../../src/sample-module/sample.controller';
import { SampleModule } from '../../../src/sample-module/sample.module';

describe('SampleController', () => {
  let appController: SampleController;
  let app:TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports:[AppModule]
    }).compile();

    appController = app.get<SampleController>(SampleController);
  });

  afterAll(async()=>{
    app.close();
  });

  describe('root', () => {
    it('controller should be defined"', () => {
      expect(appController).toBeDefined()
    });
  });
});
