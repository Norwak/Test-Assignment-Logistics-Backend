import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';
import { OffersModule } from './modules/offers/offers.module';
import 'dotenv/config'
import { Offer } from './modules/offers/entities/offer.entity';
import { CarriersModule } from './modules/carriers/carriers.module';
import { ClientsModule } from './modules/clients/clients.module';
import { Carrier } from './modules/carriers/entities/carrier.entity';
import { Client } from './modules/clients/entities/client.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DEV_DB_NAME,
      entities: [Offer, Carrier, Client],
      synchronize: true,
    }),
    OffersModule,
    CarriersModule,
    ClientsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        }
      }),
    },
  ],
})
export class AppModule {}
