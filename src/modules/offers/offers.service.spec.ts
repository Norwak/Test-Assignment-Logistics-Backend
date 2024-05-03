import { Test, TestingModule } from '@nestjs/testing';
import { OffersService } from './offers.service';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../../../test/extra/dataSourceOptions';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('OffersService', () => {
  let offersService: OffersService;
  let dataSource: DataSource;

  const dummyOffer1: Partial<Offer> = {
    client: 'Ozon',
    carrier: 'ИП Иванов',
    carrierPhone: '310-10-10',
    atiId: 123,
  }
  const dummyOffer2: Partial<Offer> = {
    client: 'Wildberries',
    carrier: 'ИП Петров',
    carrierPhone: '88001231212',
    notes: 'Разгрузочная зона позади дома',
    atiId: 1234,
  }
  const dummyOffer3: Partial<Offer> = {
    date: new Date('2024-04-17T13:24:00.000Z'),
    client: 'Yandex.Market',
    carrier: 'ИП Сидоров',
    carrierPhone: '+7 (343) 000-00-00',
    notes: 'Привезти груз утром',
    status: 2,
    atiId: 12345,
  }

  beforeEach(async () => {
    dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();

    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        OffersService,
        {
          provide: getRepositoryToken(Offer),
          useValue: dataSource.getRepository(Offer),
        }
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

    const offers = await offersService.search({client: 'oz'});
    expect(offers.length).toEqual(1);
    expect(offers[0].client).toEqual('Ozon');
    expect(offers[0].date.getUTCHours()).toEqual(new Date().getUTCHours());
  });

  it('[search] should return an array of offers matching a complex search query #2', async () => {
    for (let i = 1; i <= 100; i++) {
      await offersService.create({...dummyOffer1, carrier: `Деловые линии #${i}`});
    }

    const offers = await offersService.search({carrier: 'дело', page: 2});
    expect(offers.length).toEqual(30);
    expect(offers[0].id).toEqual(31);
  });

  it('[search] should return an array of offers matching a complex search query #3', async () => {
    await offersService.create(dummyOffer1);
    await offersService.create(dummyOffer2);
    await offersService.create(dummyOffer3);

    const offers = await offersService.search({carrierPhone: '88001231212', status: 0});
    expect(offers.length).toEqual(1);
    expect(offers[0].client).toEqual('Wildberries');
  });



  it('[findOne] should return an offer with given id', async () => {
    const offer = await offersService.create(dummyOffer1);

    const foundOffer = await offersService.findOne(offer.id);
    expect(foundOffer.title).toEqual('Ozon');
    expect(foundOffer.atiId).toEqual(123);
  });

  it('[findOne] should throw a NotFoundException if offer\'s id doesn\'t exist', async () => {
    await expect(offersService.findOne(12514)).rejects.toThrow(NotFoundException);
  });

  it('[findOne] should throw a BadRequestException if offer\'s id isn\'t valid', async () => {
    await expect(offersService.findOne(-15)).rejects.toThrow(BadRequestException);
    await expect(offersService.findOne(undefined)).rejects.toThrow(BadRequestException);
  });



  it('[create] should create an offer with passed and return it along with ID', async () => {
    const createdGame = await offersService.create(dummyOffer1);
    expect(createdGame.id).toEqual(1);
    expect(createdGame.client).toEqual('Ozon');
  });

  it('[create] should throw a BadRequestException if offer\'s date isn\'t valid', async () => {
    await expect(offersService.create({...dummyOffer1, date: new Date('1700-12-01T05:05:05.000Z')})).rejects.toThrow(BadRequestException);
  });

  it('[create] should throw a BadRequestException if offer\'s client is\'t valid', async () => {
    await expect(offersService.create({...dummyOffer1, client: ''})).rejects.toThrow(BadRequestException);
    await expect(offersService.create({...dummyOffer1, client: null})).rejects.toThrow(BadRequestException);
    await expect(offersService.create({...dummyOffer1, client: false})).rejects.toThrow(BadRequestException);
    await expect(offersService.create({...dummyOffer1, client: undefined})).rejects.toThrow(BadRequestException);
  });

});
