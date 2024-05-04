import { IsDate, IsInt, IsOptional, IsPositive, IsString } from "class-validator";

export class UpdateOfferDto {
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
  @IsOptional()
  clientId?: number;

  @IsPositive()
  @IsOptional()
  carrierId?: number;
}