import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, JoinColumn} from "typeorm";
import { Situation } from "./Situations";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;
    
    @Column({unique: true})
    email!: string;

    @ManyToOne(() => Situation, (situation) => situation.users)
    @JoinColumn({name: 'situationId'})
    situation!: Situation;
    
    @Column({type: 'timestamp', default: () => "CURRENT TIMESTAMP"})
    createdAt!: Date;

    @Column({type: 'timestamp', default: () => "CURRENT TIMESTAMP", onUpdate: "CURRENT TIMESTAMP"})
    updatedAt!: Date;
}

