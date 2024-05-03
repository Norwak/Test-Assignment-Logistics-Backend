import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../../../test/extra/dataSourceOptions';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ClientsService', () => {
  let clientsService: ClientsService;
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();

    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: getRepositoryToken(Client),
          useValue: dataSource.getRepository(Client),
        }
      ],
    }).compile();

    clientsService = testingModule.get<ClientsService>(ClientsService);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });



  it('should be defined', () => {
    expect(clientsService).toBeDefined();
  });



  it('[find] should return an array of items matching search query #1', async () => {
    await clientsService.create({ name: 'Item #1' });

    const items = await clientsService.find('Item #1');
    expect(items.length).toEqual(1);
    expect(items[0].name).toEqual('Item #1');
  });

  it('[find] should return an array of items matching search query #2', async () => {
    await clientsService.create({ name: 'Item #1' });
    await clientsService.create({ name: 'Item #2' });
    await clientsService.create({ name: 'Test #3' });

    const items = await clientsService.find('item');
    expect(items.length).toEqual(2);
    expect(items[0].name).toEqual('Item #1');
    expect(items[1].name).toEqual('Item #2');
  });

  it('[find] should return an empty array if no results found', async () => {
    await clientsService.create({ name: 'Item #1' });
    await clientsService.create({ name: 'Item #2' });
    await clientsService.create({ name: 'Item #3' });

    const items = await clientsService.find('q');
    expect(items.length).toEqual(0);
  });



  it('[findOne] should return an item with given id', async () => {
    const item = await clientsService.create({ name: 'Item #1' });
    const foundItem = await clientsService.findOne(item.id);
    expect(foundItem.name).toEqual('Item #1');
  });

  it('[findOne] should throw a NotFoundException if item\'s id doesn\'t exist', async () => {
    await expect(clientsService.findOne(12514)).rejects.toThrow(NotFoundException);
  });

  it('[findOne] should throw a BadRequestException if item\'s id isn\'t valid', async () => {
    await expect(clientsService.findOne(-15)).rejects.toThrow(BadRequestException);
    await expect(clientsService.findOne(undefined)).rejects.toThrow(BadRequestException);
  });



  it('[create] should create an item with given name and return it', async () => {
    const createdItem = await clientsService.create({ name: 'Item #1' });
    expect(createdItem.name).toEqual('Item #1');
  });

  it('[create] should throw a BadRequestException if item\'s name is invalid', async () => {
    await expect(clientsService.create({ name: '' })).rejects.toThrow(BadRequestException);
  });

  it('[create] should throw a BadRequestException if item\'s name already exists', async () => {
    await clientsService.create({ name: 'Item #1' });
    await expect(clientsService.create({ name: 'Item #1' })).rejects.toThrow(BadRequestException);
  });



  it('[update] should update an item\'s data with given ID and return updated item', async () => {
    const item = await clientsService.create({ name: 'TIem #1' });
    const updatedItem = await clientsService.update(item.id, {name: 'Item #1'});
    expect(updatedItem.name).toEqual('Item #1');
  });

  it('[update] should throw a BadRequestException if item\'s id is invalid', async () => {
    await clientsService.create({ name: 'TIem #1' });
    await expect(clientsService.update(-10, { name: '' })).rejects.toThrow(BadRequestException);
  });

  it('[update] should throw a BadRequestException if item\'s name is invalid', async () => {
    const item = await clientsService.create({ name: 'TIem #1' });
    await expect(clientsService.update(item.id, { name: '' })).rejects.toThrow(BadRequestException);
  });

  it('[update] should throw a NotFoundException if item\'s id doesn\'t exist', async () => {
    await expect(clientsService.update(123, { name: '' })).rejects.toThrow(NotFoundException);
  });



  it('[remove] should delete an item with given ID and return it', async () => {
    const item = await clientsService.create({ name: 'Item #1' });
    const deletedItem = await clientsService.remove(item.id);
    expect(deletedItem).toBeDefined();
    expect(deletedItem.id).toEqual(undefined);
  });

  it('[remove] should throw a BadRequestException if item\'s id is invalid', async () => {
    await expect(clientsService.remove(undefined)).rejects.toThrow(BadRequestException);
  });

  it('[remove] should throw a NotFoundException if item\'s id doesn\'t exist', async () => {
    await expect(clientsService.remove(123)).rejects.toThrow(NotFoundException);
  });
});
