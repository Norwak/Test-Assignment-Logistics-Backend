import { Expose } from "class-transformer";

export class CarrierDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  phone: string;

  @Expose()
  atiId: number;
}