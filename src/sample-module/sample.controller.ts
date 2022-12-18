import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AllowAnon } from '../auth/decorators/allow-anon.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SampleDto } from './dtos/sample.dto';
import { SampleService } from './sample.service';
import { SampleModel } from './schemas';

@Controller('sample')
@ApiTags('Sample Controller')
export class SampleController {
  constructor(private readonly sampleService: SampleService) {}

  @Get()
  @AllowAnon()
  public async getSampelMessage(): Promise<string> {
    return this.sampleService.getMessage();
  }

  @Get('guarded')
  @UseGuards(JwtAuthGuard)
  public async guardedEndpoint(@Req() req: any): Promise<any> {
    return {
      message: 'You have access to this endpoint',
      user: req.user,
    };
  }

  @Get(':id')
  @AllowAnon()
  public async getById(@Param('id') id: string): Promise<SampleModel> {
    return this.sampleService.getSampleById(id);
  }

  @Post()
  @AllowAnon()
  public async create(@Body() dto: SampleDto): Promise<SampleModel> {
    return this.sampleService.create(dto);
  }

  @Patch(':id')
  @AllowAnon()
  public async update(
    @Param('id') id: string,
    @Body() dto: SampleDto,
  ): Promise<SampleModel> {
    return dto as any;
  }
}
