import { Module } from '@nestjs/common';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { ClientsService } from '../clients/clients.service';
import { CarriersService } from '../carriers/carriers.service';
import { Client } from '../clients/entities/client.entity';
import { Carrier } from '../carriers/entities/carrier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Offer, Client, Carrier])],
  controllers: [OffersController],
  providers: [
    OffersService,
    ClientsService,
    CarriersService,
  ],
})
export class OffersModule {}
