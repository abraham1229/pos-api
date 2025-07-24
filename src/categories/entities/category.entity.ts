import { Product } from "src/products/entities/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

// Using data mapper because 
@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 60 })
  name: string

  @OneToMany(() => Product, (product) => product.category, {cascade: true})
  products: Product[]
}
