import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  client: string;

  @Column()
  carrier: string;

  @Column()
  carrierPhone: string;

  @Column()
  notes: string;

  @Column()
  status: number;

  @Column()
  atiId: number;
}