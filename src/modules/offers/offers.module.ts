import { Module } from '@nestjs/common';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { ClientsService } from '../clients/clients.service';
import { CarriersService } from '../carriers/carriers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Offer])],
  controllers: [OffersController],
  providers: [
    OffersService,
    ClientsService,
    CarriersService,
  ],
})
export class OffersModule {}
