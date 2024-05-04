import { Test, TestingModule } from '@nestjs/testing';
import { CarriersController } from './carriers.controller';
import { CarriersService } from './carriers.service';
import { Carrier } from './entities/carrier.entity';
import { BadRequestException } from '@nestjs/common';

describe('CarriersController', () => {
  let carriersController: CarriersController;
  let fakeCarriersService: Partial<CarriersService>;

  beforeEach(async () => {
    fakeCarriersService = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarriersController],
      providers: [
        {
          provide: CarriersService,
          useValue: fakeCarriersService,
        }
      ]
    }).compile();

    carriersController = module.get<CarriersController>(CarriersController);
  });



  it('should be defined', () => {
    expect(carriersController).toBeDefined();
  });



  it('[find] should return an array with items that match search query', async () => {
    fakeCarriersService.find = () => {
      return Promise.resolve([{id: 1, name: 'Деловые линии'} as Carrier]);
    }

    const items = await carriersController.find('on');
    expect(items.length).toEqual(1);
  });



  it('[findOne] should return the item with given id', async () => {
    fakeCarriersService.findOne = () => {
      return Promise.resolve({id: 1, name: 'Деловые линии'} as Carrier);
    }

    const item = await carriersController.findOne(1);
    expect(item.name).toEqual('Деловые линии');
  });



  it('[create] should return an item back with assigned id', async () => {
    fakeCarriersService.create = () => {
      return Promise.resolve({id: 1, name: 'Деловые линии'} as Carrier);
    }

    const item = await carriersController.create({name: 'Деловые линии'});
    expect(item).toHaveProperty('id');
  });

  it('[create] should throw BadRequestException if title isn\'t valid', async () => {
    fakeCarriersService.create = () => {
      throw new BadRequestException('title shouldn\'t be empty');
    }

    // @ts-ignore
    await expect(carriersController.create({name: undefined})).rejects.toThrow(BadRequestException);
  });



  it('[update] should return an item with updated data', async () => {
    fakeCarriersService.update = () => {
      return Promise.resolve({id: 1, name: 'Деловые линии'} as Carrier);
    }

    const updatedItem = await carriersController.update(1, {name: 'Деловые линии'});
    expect(updatedItem.id).toEqual(1);
    expect(updatedItem.name).toEqual('Деловые линии');
  });



  it('[remove] should delete an item by id and return it\'s object back without id', async () => {
    fakeCarriersService.remove = () => {
      return Promise.resolve({name: 'Деловые линии'} as Carrier);
    }

    const deletedItem = await carriersController.remove(1);
    expect(deletedItem.name).toEqual('Деловые линии');
    expect(deletedItem).not.toHaveProperty('id');
  });
});
