import { Test, TestingModule } from '@nestjs/testing';
import { CarriersService } from './carriers.service';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../../../test/extra/dataSourceOptions';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Carrier } from './entities/carrier.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CarriersService', () => {
  let carriersService: CarriersService;
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = new DataSource(dataSourceOptions);
    await dataSource.initialize();

    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        CarriersService,
        {
          provide: getRepositoryToken(Carrier),
          useValue: dataSource.getRepository(Carrier),
        }
      ],
    }).compile();

    carriersService = testingModule.get<CarriersService>(CarriersService);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });



  it('should be defined', () => {
    expect(carriersService).toBeDefined();
  });



  it('[find] should return an array of items matching search query #1', async () => {
    await carriersService.create({ name: 'Item #1', phone: '+7 (343) 000-00-00', atiId: 123 });

    const items = await carriersService.find('Item #1');
    expect(items.length).toEqual(1);
    expect(items[0].name).toEqual('Item #1');
    expect(items[0].phone).toEqual('+7 (343) 000-00-00');
    expect(items[0].atiId).toEqual(123);
  });

  it('[find] should return an array of items matching search query #2', async () => {
    await carriersService.create({ name: 'Item #1' });
    await carriersService.create({ name: 'Item #2' });
    await carriersService.create({ name: 'Test #3' });

    const items = await carriersService.find('item');
    expect(items.length).toEqual(2);
    expect(items[0].name).toEqual('Item #1');
    expect(items[1].name).toEqual('Item #2');
  });

  it('[find] should return an empty array if no results found', async () => {
    await carriersService.create({ name: 'Item #1' });
    await carriersService.create({ name: 'Item #2' });
    await carriersService.create({ name: 'Item #3' });

    const items = await carriersService.find('q');
    expect(items.length).toEqual(0);
  });



  it('[findOne] should return an item with given id', async () => {
    const item = await carriersService.create({ name: 'Item #1' });
    const foundItem = await carriersService.findOne(item.id);
    expect(foundItem.name).toEqual('Item #1');
  });

  it('[findOne] should throw a NotFoundException if item\'s id doesn\'t exist', async () => {
    await expect(carriersService.findOne(12514)).rejects.toThrow(NotFoundException);
  });

  it('[findOne] should throw a BadRequestException if item\'s id isn\'t valid', async () => {
    await expect(carriersService.findOne(-15)).rejects.toThrow(BadRequestException);
    // @ts-ignore
    await expect(carriersService.findOne(undefined)).rejects.toThrow(BadRequestException);
  });



  it('[create] should create an item with given name and return it', async () => {
    const createdItem = await carriersService.create({ name: 'Item #1' });
    expect(createdItem.name).toEqual('Item #1');
  });

  it('[create] should throw a BadRequestException if item\'s name is invalid', async () => {
    await expect(carriersService.create({ name: '' })).rejects.toThrow(BadRequestException);
  });

  it('[create] should throw a BadRequestException if item\'s name already exists', async () => {
    await carriersService.create({ name: 'Item #1' });
    await expect(carriersService.create({ name: 'Item #1' })).rejects.toThrow(BadRequestException);
  });



  it('[update] should update an item\'s data with given ID and return updated item', async () => {
    const item = await carriersService.create({ name: 'TIem #1' });
    const updatedItem = await carriersService.update(item.id, {name: 'Item #1'});
    expect(updatedItem.name).toEqual('Item #1');
  });

  it('[update] should throw a BadRequestException if item\'s id is invalid', async () => {
    await carriersService.create({ name: 'TIem #1' });
    await expect(carriersService.update(-10, { name: '' })).rejects.toThrow(BadRequestException);
  });

  it('[update] should throw a BadRequestException if item\'s name is invalid', async () => {
    const item = await carriersService.create({ name: 'TIem #1' });
    await expect(carriersService.update(item.id, { name: '' })).rejects.toThrow(BadRequestException);
  });

  it('[update] should throw a NotFoundException if item\'s id doesn\'t exist', async () => {
    await expect(carriersService.update(123, { name: 'Item #1' })).rejects.toThrow(NotFoundException);
  });



  it('[remove] should delete an item with given ID and return it', async () => {
    const item = await carriersService.create({ name: 'Item #1' });
    const deletedItem = await carriersService.remove(item.id);
    expect(deletedItem).toBeDefined();
    expect(deletedItem.id).toEqual(undefined);
  });

  it('[remove] should throw a BadRequestException if item\'s id is invalid', async () => {
    // @ts-ignore
    await expect(carriersService.remove(undefined)).rejects.toThrow(BadRequestException);
  });

  it('[remove] should throw a NotFoundException if item\'s id doesn\'t exist', async () => {
    await expect(carriersService.remove(123)).rejects.toThrow(NotFoundException);
  });
});
