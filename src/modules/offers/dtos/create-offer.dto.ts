import { IsDate, IsInt, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateOfferDto {
  @IsDate()
  @IsOptional()
  date?: Date;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsInt()
  @IsOptional()
  status?: number;

  @IsPositive()
  clientId: number;

  @IsPositive()
  carrierId: number;
}