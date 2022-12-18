import { IsOptional } from 'class-validator';

export class SampleDto {
  @IsOptional()
  public _id: string;

  @IsOptional()
  public name: string;

  @IsOptional()
  public age: number;

  @IsOptional()
  public isAvailable: boolean;

  @IsOptional()
  public implecitType: string[];

  @IsOptional()
  public ownerId: string;

  @IsOptional()
  public details: any;
}
