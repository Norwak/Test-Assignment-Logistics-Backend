import { IsArray, IsDate, IsInt, IsNumber, IsNumberString, IsOptional, IsString, Min } from "class-validator";

export class SearchOffersDto {
  @IsDate()
  @IsOptional()
  date?: Date;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @IsNumberString({}, {each: true})
  @IsOptional()
  status?: number[];

  @IsArray()
  @IsNumberString({}, {each: true})
  @IsOptional()
  clientId?: number[];

  @IsArray()
  @IsNumberString({}, {each: true})
  @IsOptional()
  carrierId?: number[];

  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number;
}