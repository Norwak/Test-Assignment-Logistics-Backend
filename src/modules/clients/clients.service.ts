import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { ILike, Repository } from 'typeorm';
import { CreateClientDto } from './dtos/create-client.dto';
import { UpdateClientDto } from './dtos/update-client.dto';

@Injectable()
export class ClientsService {
  constructor (
    @InjectRepository(Client) private clientsRepository: Repository<Client>
  ) {}

  async find(query: string) {
    const name = query || '';
    return await this.clientsRepository.find({where: {name: ILike(`%${name}%`)}});
  }

  async findOne(id: number) {
    if (!id || id < 1) {
      throw new BadRequestException('id isn\'t a positive number');
    }

    const client = await this.clientsRepository.findOne({where: {id}});
    if (!client) {
      throw new NotFoundException('client not found with given id');
    }

    return client;
  }

  async create({name}: CreateClientDto) {
    if (!name || name === '') {
      throw new BadRequestException('name shouldn\'t be empty');
    }

    const clients = await this.find(name);
    if (clients.length > 0) {
      throw new BadRequestException('client already exists');
    }

    const client = this.clientsRepository.create({name});
    return await this.clientsRepository.save(client);
  }

  async update(id: number, newData: UpdateClientDto) {
    if (!id || id < 1) {
      throw new BadRequestException('id isn\'t a positive number');
    }

    if (!newData.name) {
      throw new BadRequestException('name shouldn\'t be empty');
    }

    const targetClient = await this.findOne(id);

    Object.assign(targetClient, newData);
    return await this.clientsRepository.save(targetClient);
  }

  async remove(id: number) {
    if (!id || id < 1) {
      throw new BadRequestException('id isn\'t a positive number');
    }

    const targetClient = await this.findOne(id);
    return await this.clientsRepository.remove(targetClient);
  }
}
