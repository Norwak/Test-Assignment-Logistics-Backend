import { Test, TestingModule } from '@nestjs/testing';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { Offer } from './entities/offer.entity';
import { BadRequestException } from '@nestjs/common';

describe('OffersController', () => {
  let offersController: OffersController;
  let fakeOffersService: Partial<OffersService>;

  beforeEach(async () => {
    fakeOffersService = {
      search: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OffersController],
      providers: [
        {
          provide: OffersService,
          useValue: fakeOffersService,
        }
      ]
    }).compile();

    offersController = module.get<OffersController>(OffersController);
  });



  it('should be defined', () => {
    expect(offersController).toBeDefined();
  });



  it('[search] should return an array of offers matching search query', async () => {
    fakeOffersService.search = () => {
      return Promise.resolve([{id: 1, client: {id: 1, name: 'Ozon'}} as Offer]);
    }

    const offers = await offersController.search({clientId: [1, 2]});
    expect(offers.length).toEqual(1);
    expect(offers[0].client.name).toEqual('Ozon');
  });



  it('[findOne] should return the offer with given id', async () => {
    fakeOffersService.findOne = () => {
      return Promise.resolve({id: 1, client: {name: 'Ozon'}} as Offer);
    }

    const offer = await offersController.findOne(1);
    expect(offer.client.name).toEqual('Ozon');
  });



  it('[create] should return a offer back with assigned id', async () => {
    fakeOffersService.create = () => {
      return Promise.resolve({id: 1, client: {name: 'Ozon'}, carrier: {name: 'CDEK'}} as Offer);
    }

    const offer = await offersController.create({clientId: 1, carrierId: 1});
    expect(offer).toHaveProperty('id');
  });

  it('[create] should throw BadRequestException if clientId isn\'t valid', async () => {
    fakeOffersService.create = () => {
      throw new BadRequestException('clientId shouldn\'t be empty');
    }

    await expect(offersController.create({clientId: -123, carrierId: 1})).rejects.toThrow(BadRequestException);
  });



  it('[update] should return a offer with updated data', async () => {
    fakeOffersService.update = () => {
      return Promise.resolve({id: 1, client: {name: 'Ozon'}, carrier: {name: 'CDEK'}} as Offer);
    }

    const updatedOffer = await offersController.update(1, {carrierId: 2});
    expect(updatedOffer.id).toEqual(1);
    expect(updatedOffer.carrier.name).toEqual('CDEK');
  });



  it('[remove] should delete an offer by id and return offer object back without id', async () => {
    fakeOffersService.remove = () => {
      return Promise.resolve({client: {name: 'Ozon'}, carrier: {name: 'CDEK'}} as Offer);
    }

    const deletedOffer = await offersController.remove(1);
    expect(deletedOffer).toHaveProperty('client');
    expect(deletedOffer).toHaveProperty('carrier');
    expect(deletedOffer).not.toHaveProperty('id');
  });
});
