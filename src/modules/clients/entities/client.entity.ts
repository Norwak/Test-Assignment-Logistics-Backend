import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Offer } from "../../offers/entities/offer.entity";

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => Offer, offer => offer.client)
  offers: Offer[];
}