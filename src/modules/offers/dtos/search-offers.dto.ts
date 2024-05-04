import { IsArray, IsDate, IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class SearchOffersDto {
  @IsDate()
  @IsOptional()
  date?: Date;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @IsInt({each: true})
  @IsOptional()
  status?: number[];

  @IsArray()
  @IsInt({each: true})
  @IsOptional()
  clientId?: number[];

  @IsArray()
  @IsInt({each: true})
  @IsOptional()
  carrierId?: number[];

  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number;
}