import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { SearchOffersDto } from './dtos/search-offers.dto';
import { CreateOfferDto } from './dtos/create-offer.dto';
import { UpdateOfferDto } from './dtos/update-offer.dto';
import { ClientsService } from '../clients/clients.service';
import { CarriersService } from '../carriers/carriers.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private offersRepository: Repository<Offer>,
    private clientsService: ClientsService,
    private carriersService: CarriersService,
  ) {}

  async search({date, notes, status, clientId, carrierId, page}: SearchOffersDto) {
    page = page || 1;

    const stmt = this.offersRepository.createQueryBuilder('offer')
      .leftJoinAndSelect('offer.client', 'clients')
      .leftJoinAndSelect('offer.carrier', 'carriers')
      .where('1 = 1');

    if (date)
      stmt.andWhere(`strftime("%Y-%m-%d", offer.date) = strftime("%Y-%m-%d", :date)`, {date})
    if (notes)
      stmt.andWhere('offer.notes LIKE :notes', {notes: `%${notes}%`});
    if (status)
      stmt.andWhere('offer.status IN (:...status)', {status})
    if (clientId)
      stmt.andWhere('offer.clientId IN (:...clientId)', {clientId})
    if (carrierId)
      stmt.andWhere('offer.carrierId IN (:...carrierId)', {carrierId})

    return stmt
      .skip((page - 1) * 30)
      .take(30)
      // .getQueryAndParameters();
      .getMany();
  }

  async findOne(id: number) {
    if (!id || id < 1) {
      throw new BadRequestException('id isn\'t a positive number');
    }

    // const offer = await this.offersRepository.findOne({where: {id}, relations: dictionaryList});
    const offer = await this.offersRepository.findOne({where: {id}});
    if (!offer) {
      throw new NotFoundException('couldn\'t find offer with given id');
    }

    return offer;
  }

  async create(data: CreateOfferDto) {
    if (data.date && data.date.getFullYear() < 1970) {
      throw new BadRequestException('date is too old');
    }
    if (Object.hasOwn(data, 'status') && (!data.status || !Number.isInteger(data.status) || data.status <= -1 || data.status >= 3)) {
      throw new BadRequestException('status is not in range of 0..2');
    }
    if (Object.hasOwn(data, 'clientId') && (!data.clientId || !Number.isInteger(data.clientId) || data.clientId < 1)) {
      throw new BadRequestException('clientId isn\'t a positive integer');
    }
    if (Object.hasOwn(data, 'carrierId') && (!data.carrierId || !Number.isInteger(data.carrierId) || data.carrierId < 1)) {
      throw new BadRequestException('carrierId isn\'t a positive integer');
    }

    const client = await this.clientsService.findOne(data.clientId);
    const carrier = await this.carriersService.findOne(data.carrierId);

    const offer = this.offersRepository.create({...data, client, carrier});
    return await this.offersRepository.save(offer);
  }

  async update(id: number, data: UpdateOfferDto) {
    if (data.date && data.date.getFullYear() < 1970) {
      throw new BadRequestException('date is too old');
    }
    if (Object.hasOwn(data, 'status') && (!data.status || !Number.isInteger(data.status) || data.status <= -1 || data.status >= 3)) {
      throw new BadRequestException('status is not in range of 0..2');
    }
    if (Object.hasOwn(data, 'clientId') && (!data.clientId || !Number.isInteger(data.clientId) || data.clientId < 1)) {
      throw new BadRequestException('clientId isn\'t a positive integer');
    }
    if (Object.hasOwn(data, 'carrierId') && (!data.carrierId || !Number.isInteger(data.carrierId) || data.carrierId < 1)) {
      throw new BadRequestException('carrierId isn\'t a positive integer');
    }

    const offer = await this.findOne(id);
    Object.assign(offer, data);

    if (data.clientId) {
      offer.client = await this.clientsService.findOne(data.clientId);
    }
    if (data.carrierId) {
      offer.carrier = await this.carriersService.findOne(data.carrierId);
    } 

    return await this.offersRepository.save(offer);
  }

  async remove(id: number) {
    const offer = await this.findOne(id);
    return await this.offersRepository.remove(offer);
  }
}
