import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { environment } from '../common/environments';
import { SampleDto } from './dtos/sample.dto';
import { SampleDocument, SampleModel, sampleSchemaName } from './schemas';

@Injectable()
export class SampleService {
  constructor(
    @InjectModel(sampleSchemaName)
    private readonly sampleModel: Model<SampleDocument>,
  ) {}

  public async getMessage(): Promise<string> {
    return `Sample controller is working: ${environment.sampleConfig}`;
  }

  public async create(dto: SampleDto): Promise<SampleModel> {
    dto._id = dto._id || uuid();
    const model = await this.sampleModel.create(dto);

    return model;
  }

  public async update(id: string, dto: SampleDto): Promise<SampleModel> {
    return this.sampleModel.findByIdAndUpdate(id, dto, { new: true });
  }

  public async getSampleById(id: string): Promise<SampleModel> {
    return this.sampleModel.findById(id);
  }
}
