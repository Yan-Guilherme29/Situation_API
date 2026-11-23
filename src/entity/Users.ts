import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate } from "typeorm";
import { Situation } from "./Situations";
import bcrypt from 'bcryptjs';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ unique: true })
    recoverPassword!: string;

    @Column()
    password!: string;

    @ManyToOne(() => Situation, (situation) => situation.users)
    @JoinColumn({ name: 'situationId' })
    situation!: Situation;

    @Column({ type: 'timestamp', default: () => "CURRENT TIMESTAMP" })
    createdAt!: Date;

    @Column({ type: 'timestamp', default: () => "CURRENT TIMESTAMP", onUpdate: "CURRENT TIMESTAMP" })
    updatedAt!: Date;

    @BeforeInsert()

    @BeforeUpdate()
    async hashPassword(): Promise<void> {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10)
        }
    }

    // Método para verificar se a senha fornecida corresponde à senha armazenada no banco de dados
    async comparePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}

