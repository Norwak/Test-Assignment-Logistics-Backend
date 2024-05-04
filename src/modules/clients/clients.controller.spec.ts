import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { Client } from './entities/client.entity';
import { BadRequestException } from '@nestjs/common';

describe('ClientsController', () => {
  let clientsController: ClientsController;
  let fakeClientsService: Partial<ClientsService>;

  beforeEach(async () => {
    fakeClientsService = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn()
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        {
          provide: ClientsService,
          useValue: fakeClientsService,
        }
      ]
    }).compile();

    clientsController = module.get<ClientsController>(ClientsController);
  });



  it('should be defined', () => {
    expect(clientsController).toBeDefined();
  });



  it('[find] should return an array with items that match search query', async () => {
    fakeClientsService.find = () => {
      return Promise.resolve([{id: 1, name: 'Ozon'} as Client]);
    }

    const items = await clientsController.find('on');
    expect(items.length).toEqual(1);
  });



  it('[findOne] should return the item with given id', async () => {
    fakeClientsService.findOne = () => {
      return Promise.resolve({id: 1, name: 'Ozon'} as Client);
    }

    const item = await clientsController.findOne(1);
    expect(item.name).toEqual('Ozon');
  });



  it('[create] should return an item back with assigned id', async () => {
    fakeClientsService.create = () => {
      return Promise.resolve({id: 1, name: 'Ozon'} as Client);
    }

    const item = await clientsController.create({name: 'Ozon'});
    expect(item).toHaveProperty('id');
  });

  it('[create] should throw BadRequestException if title isn\'t valid', async () => {
    fakeClientsService.create = () => {
      throw new BadRequestException('title shouldn\'t be empty');
    }

    // @ts-ignore
    await expect(clientsController.create({name: undefined})).rejects.toThrow(BadRequestException);
  });



  it('[update] should return an item with updated data', async () => {
    fakeClientsService.update = () => {
      return Promise.resolve({id: 1, name: 'Ozon'} as Client);
    }

    const updatedItem = await clientsController.update(1, {name: 'Ozon'});
    expect(updatedItem.id).toEqual(1);
    expect(updatedItem.name).toEqual('Ozon');
  });



  it('[remove] should delete an item by id and return it\'s object back without id', async () => {
    fakeClientsService.remove = () => {
      return Promise.resolve({name: 'Ozon'} as Client);
    }

    const deletedItem = await clientsController.remove(1);
    expect(deletedItem.name).toEqual('Ozon');
    expect(deletedItem).not.toHaveProperty('id');
  });
});
