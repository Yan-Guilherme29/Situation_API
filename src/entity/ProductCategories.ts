import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('product_categories')
export class ProductCategory {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique: true})
    name!: string;

    @Column({type: 'timestamp', default: () => "CURRENT TIMESTAMP"})
    createdAt!: Date;

    @Column({type: 'timestamp', default: () => "CURRENT TIMESTAMP", onUpdate: "CURRENT TIMESTAMP"})
    updatedAt!: Date;

}


