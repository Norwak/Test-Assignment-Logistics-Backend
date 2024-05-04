import { IsString } from "class-validator";

export class UpdateClientDto {
  @IsString()
  name: string;
}