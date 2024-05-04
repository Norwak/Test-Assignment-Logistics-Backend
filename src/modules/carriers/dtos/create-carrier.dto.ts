import { IsInt, IsOptional, IsString } from "class-validator";

export class CreateCarrierDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsInt()
  @IsOptional()
  atiId?: number;
}