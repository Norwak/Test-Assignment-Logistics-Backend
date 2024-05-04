import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Carrier } from './entities/carrier.entity';
import { ILike, Repository } from 'typeorm';
import { CreateCarrierDto } from './dtos/create-carrier.dto';
import { UpdateCarrierDto } from './dtos/update-carrier.dto';

@Injectable()
export class CarriersService {
  constructor (
    @InjectRepository(Carrier) private carriersRepository: Repository<Carrier>
  ) {}

  async find(query: string) {
    const name = query || '';
    return await this.carriersRepository.find({where: {name: ILike(`%${name}%`)}});
  }

  async findOne(id: number) {
    if (!id || id < 1) {
      throw new BadRequestException('id isn\'t a positive number');
    }

    const carrier = await this.carriersRepository.findOne({where: {id}});
    if (!carrier) {
      throw new NotFoundException('carrier not found with given id');
    }

    return carrier;
  }

  async create({name, phone, atiId}: CreateCarrierDto) {
    if (!name || name === '') {
      throw new BadRequestException('name shouldn\'t be empty');
    }

    const carriers = await this.find(name);
    if (carriers.length > 0) {
      throw new BadRequestException('carrier already exists');
    }

    const carrier = this.carriersRepository.create({name, phone, atiId});
    return await this.carriersRepository.save(carrier);
  }

  async update(id: number, newData: UpdateCarrierDto) {
    if (!id || id < 1) {
      throw new BadRequestException('id isn\'t a positive number');
    }

    if (!newData.name) {
      throw new BadRequestException('name shouldn\'t be empty');
    }

    const targetCarrier = await this.findOne(id);

    Object.assign(targetCarrier, newData);
    return await this.carriersRepository.save(targetCarrier);
  }

  async remove(id: number) {
    if (!id || id < 1) {
      throw new BadRequestException('id isn\'t a positive number');
    }

    const targetCarrier = await this.findOne(id);
    return await this.carriersRepository.remove(targetCarrier);
  }
}
