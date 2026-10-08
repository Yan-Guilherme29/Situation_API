import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ProductCategory } from "./ProductCategories";
import { ProductSituation } from "./ProductSituations";

@Entity('products')
export class Product {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @ManyToOne(() => ProductCategory, (category) => category.products)
    @JoinColumn({ name: 'productCategoryId' })
    category!: ProductCategory;

    @ManyToOne(() => ProductSituation, (situation) => situation.products)
    @JoinColumn({ name: 'productSituationId' })
    situation!: ProductSituation;

    @Column({type: 'timestamp', default: () => "CURRENT TIMESTAMP"})
    createdAt!: Date;

    @Column({type: 'timestamp', default: () => "CURRENT TIMESTAMP", onUpdate: "CURRENT TIMESTAMP"})
    updatedAt!: Date;
}