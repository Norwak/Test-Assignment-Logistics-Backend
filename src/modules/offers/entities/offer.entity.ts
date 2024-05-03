import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "../../clients/entities/client.entity";
import { Carrier } from "../../carriers/entities/carrier.entity";

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: "CURRENT_TIMESTAMP"})
  date: Date;

  @Column()
  notes: string;

  // 0 = new, 1 = underway, 2 = done
  @Column({default: 0})
  status: number;



  @ManyToOne(type => Client, client => client.offers, {nullable: false, eager: true})
  @JoinColumn()
  client: Client;

  @ManyToOne(type => Carrier, carrier => carrier.offers, {nullable: false, eager: true})
  @JoinColumn()
  carrier: Carrier;
}