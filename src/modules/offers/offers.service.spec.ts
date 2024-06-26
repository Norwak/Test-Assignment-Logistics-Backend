import { Test, TestingModule } from '@nestjs/testing';
import { OffersService } from './offers.service';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../../../test/extra/dataSourceOptions';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ClientsService } from '../clients/clients.service';
import { CarriersService } from '../carriers/carriers.service';
import { Client } from '../clients/entities/client.entity';
import { Carrier } from '../carriers/entities/carrier.entity';
import { CreateOfferDto } from './dtos/create-offer.dto';

describe('OffersService', () => {
  let offersService: OffersService;
  let fakeClientsService: Partial<ClientsService>;
  let fakeCarriersService: Partial<CarriersService>;
  let dataSource: DataSource;


  const dummyClients = [
    {id: 1, name: 'Ozon'} as Client,
    {id: 2, name: 'Wildberries'} as Client,
    {id: 3, name: 'Yandex.Market'} as Client,
  ]

  const dummyCarriers = [
    {id: 1, name: 'Деловые линии', phone: '+7 (343) 000-00-00', atiId: 123} as Carrier,
    {id: 2, name: 'CDEK', phone: '88001231212', atiId: 1234} as Carrier,
  ]

  const dummyOffer1: CreateOfferDto = {
    clientId: 1,
    carrierId: 1,
  }
  const dummyOffer2: CreateOfferDto = {
    clientId: 2,
    carrierId: 1,
    notes: 'Разгрузочная зона позади дома',
  }
  const dummyOffer3: CreateOfferDto = {
    date: new Date('2024-04-17T13:24:00.000Z'),
    clientId: 3,
    carrierId: 2,
    notes: 'Привезти груз утром',
    status: 2,
  }


  beforeEach(async () => {
    dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();

    await dataSource.createQueryBuilder().insert().into(Client).values(dummyClients).execute();
    await dataSource.createQueryBuilder().insert().into(Carrier).values(dummyCarriers).execute();

    fakeClientsService = {
      findOne: (id: number) => {
        switch (id) {
          case 1:
            return Promise.resolve(dummyClients[0]);
        
          case 2:
            return Promise.resolve(dummyClients[1]);
        
          case 3:
            return Promise.resolve(dummyClients[2]);

          default:
            throw new NotFoundException('Couldn\'t find a client with given id');
        }
      },
    }

    fakeCarriersService = {
      findOne: (id: number) => {
        switch (id) {
          case 1:
            return Promise.resolve(dummyCarriers[0]);
        
          case 2:
            return Promise.resolve(dummyCarriers[1]);

          default:
            throw new NotFoundException('Couldn\'t find a carrier with given id');
        }
      },
    }

    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        OffersService,
        {
          provide: getRepositoryToken(Offer),
          useValue: dataSource.getRepository(Offer),
        },
        {
          provide: ClientsService,
          useValue: fakeClientsService,
        },
        {
          provide: CarriersService,
          useValue: fakeCarriersService,
        },
      ],
    }).compile();

    offersService = testingModule.get<OffersService>(OffersService);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });



  it('should be defined', () => {
    expect(offersService).toBeDefined();
  });



  it('[search] should return an array of offers matching a complex search query #1', async () => {
    await offersService.create(dummyOffer1);
    const now = new Date();

    const offers = await offersService.search({clientId: [1, 2]});
    expect(offers.length).toEqual(1);
    expect(offers[0].client.name).toEqual('Ozon');
    expect(offers[0].date.getUTCHours()).toEqual(now.getUTCHours());
  });

  it('[search] should return an array of offers matching a complex search query #2', async () => {
    for (let i = 1; i <= 100; i++) {
      await offersService.create(dummyOffer1);
    }

    const offers = await offersService.search({carrierId: [1], page: 2});
    expect(offers.length).toEqual(30);
    expect(offers[0].id).toEqual(31);
  });

  it('[search] should return an array of offers matching a complex search query #3', async () => {
    await offersService.create(dummyOffer1);
    await offersService.create(dummyOffer2);
    await offersService.create(dummyOffer3);

    const offers = await offersService.search({carrierId: [2], status: [2]});
    expect(offers.length).toEqual(1);
    expect(offers[0].client.name).toEqual('Yandex.Market');
  });



  it('[findOne] should return an offer with given id', async () => {
    const offer = await offersService.create(dummyOffer1);

    const foundOffer = await offersService.findOne(offer.id);
    expect(foundOffer.client.name).toEqual('Ozon');
    expect(foundOffer.carrier.atiId).toEqual(123);
  });

  it('[findOne] should throw a NotFoundException if offer\'s id doesn\'t exist', async () => {
    await expect(offersService.findOne(12514)).rejects.toThrow(NotFoundException);
  });

  it('[findOne] should throw a BadRequestException if offer\'s id isn\'t valid', async () => {
    await expect(offersService.findOne(-15)).rejects.toThrow(BadRequestException);
    // @ts-ignore
    await expect(offersService.findOne(undefined)).rejects.toThrow(BadRequestException);
  });



  it('[create] should create an offer with passed and return it along with ID', async () => {
    const createdOffer = await offersService.create(dummyOffer1);
    expect(createdOffer.id).toEqual(1);
    expect(createdOffer.client.name).toEqual('Ozon');
    expect(createdOffer.carrier.name).toEqual('Деловые линии');
  });

  it('[create] should throw a BadRequestException if offer\'s date isn\'t valid', async () => {
    await expect(offersService.create({...dummyOffer1, date: new Date('1700-12-01T05:05:05.000Z')})).rejects.toThrow(BadRequestException);
  });

  it('[create] should throw an exception if client\'s id doesn\'t exist or invalid', async () => {
    await expect(offersService.create({...dummyOffer1, clientId: 50})).rejects.toThrow(NotFoundException);
    // @ts-ignore
    await expect(offersService.create({...dummyOffer1, clientId: ''})).rejects.toThrow(BadRequestException);
    // @ts-ignore
    await expect(offersService.create({...dummyOffer1, clientId: 'A number'})).rejects.toThrow(BadRequestException);
    // @ts-ignore
    await expect(offersService.create({...dummyOffer1, clientId: undefined})).rejects.toThrow(BadRequestException);
  });

  it('[create] should throw an exception if carrier\'s id doesn\'t exist or invalid', async () => {
    await expect(offersService.create({...dummyOffer1, carrierId: 50})).rejects.toThrow(NotFoundException);
    // @ts-ignore
    await expect(offersService.create({...dummyOffer1, carrierId: ''})).rejects.toThrow(BadRequestException);
    // @ts-ignore
    await expect(offersService.create({...dummyOffer1, carrierId: 'A number'})).rejects.toThrow(BadRequestException);
    // @ts-ignore
    await expect(offersService.create({...dummyOffer1, carrierId: undefined})).rejects.toThrow(BadRequestException);
  });

  it('[create] should throw a BadRequestException if status isn\'t valid', async () => {
    await expect(offersService.create({...dummyOffer1, status: -1})).rejects.toThrow(BadRequestException);
    await expect(offersService.create({...dummyOffer1, status: 3})).rejects.toThrow(BadRequestException);
  });



  it('[update] should update a offer\'s data with given ID and return updated offer', async () => {
    const offer = await offersService.create(dummyOffer1);
    const updatedOffer = await offersService.update(offer.id, {clientId: 2, carrierId: 2});
    expect(updatedOffer.client.name).toEqual('Wildberries');
    expect(updatedOffer.carrier.name).toEqual('CDEK');
  });

  it('[update] should throw a BadRequestException if offer\'s id is invalid', async () => {
    await offersService.create(dummyOffer1);
    await expect(offersService.update(-10, { date: new Date('2023-12-01T05:05:05.000Z') })).rejects.toThrow(BadRequestException);
  });

  it('[update] should throw a NotFoundException if offer\'s id doesn\'t exist', async () => {
    await expect(offersService.update(123, { date: new Date('2023-12-01T05:05:05.000Z') })).rejects.toThrow(NotFoundException);
  });

  it('[update] should throw an exception if client\'s id is invalid', async () => {
    const offer = await offersService.create(dummyOffer1);
    await expect(offersService.update(offer.id, { clientId: 50 })).rejects.toThrow(NotFoundException);
    // @ts-ignore
    await expect(offersService.update(offer.id, { clientId: '' })).rejects.toThrow(BadRequestException);
    // @ts-ignore
    await expect(offersService.update(offer.id, { clientId: 'A number' })).rejects.toThrow(BadRequestException);
  });

  it('[update] should throw an exception if carrier\'s id is invalid', async () => {
    const offer = await offersService.create(dummyOffer1);
    await expect(offersService.update(offer.id, { carrierId: 50 })).rejects.toThrow(NotFoundException);
    // @ts-ignore
    await expect(offersService.update(offer.id, { carrierId: '' })).rejects.toThrow(BadRequestException);
    // @ts-ignore
    await expect(offersService.update(offer.id, { carrierId: 'A number' })).rejects.toThrow(BadRequestException);
  });

  it('[update] should throw a BadRequestException if status isn\'t valid', async () => {
    const offer = await offersService.create(dummyOffer1);
    await expect(offersService.update(offer.id, { status: -1 })).rejects.toThrow(BadRequestException);
    await expect(offersService.update(offer.id, { status: 3 })).rejects.toThrow(BadRequestException);
    // @ts-ignore
    await expect(offersService.update(offer.id, { status: '' })).rejects.toThrow(BadRequestException);
  });

  

  it('[remove] should delete a offer with given ID and return them', async () => {
    const offer = await offersService.create(dummyOffer1);
    const deletedOffer = await offersService.remove(offer.id);
    expect(deletedOffer).toBeDefined();
  });

  it('[remove] should throw a BadRequestException if offer\'s id is invalid', async () => {
    // @ts-ignore
    await expect(offersService.remove(undefined)).rejects.toThrow(BadRequestException);
  });

  it('[remove] should throw a NotFoundException if offer\'s id doesn\'t exist', async () => {
    await expect(offersService.remove(123)).rejects.toThrow(NotFoundException);
  });
});
