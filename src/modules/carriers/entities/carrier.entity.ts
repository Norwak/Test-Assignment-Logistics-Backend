import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Offer } from "../../offers/entities/offer.entity";

@Entity()
export class Carrier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({nullable: true})
  phone: string;

  @Column({nullable: true})
  atiId: number;

  @OneToMany(type => Offer, offer => offer.carrier)
  offers: Offer[];
}