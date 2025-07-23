import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// Using data mapper because 
@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 60 })
  name: string
}
