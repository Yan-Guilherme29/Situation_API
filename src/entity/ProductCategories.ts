import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Products";


@Entity('product_categories')
export class ProductCategory {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique: true})
    name!: string;

    @OneToMany(() => Product, (product) => product.category)
    products!: Product[];

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    createdAt!: Date;

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
    updatedAt!: Date;

}


