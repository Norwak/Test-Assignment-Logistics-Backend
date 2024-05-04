import { Expose, Type } from "class-transformer";
import { Client } from "../../clients/entities/client.entity";
import { ClientDto } from "../../clients/dtos/client.dto";
import { CarrierDto } from "../../carriers/dtos/carrier.dto";
import { Carrier } from "../../carriers/entities/carrier.entity";

export class OfferDto {
  @Expose()
  id: number;

  @Expose()
  date: Date;

  @Expose()
  notes: string;

  @Expose()
  status: number[];

  @Expose()
  @Type(() => ClientDto)
  client: Client;

  @Expose()
  @Type(() => CarrierDto)
  carrier: Carrier;
}