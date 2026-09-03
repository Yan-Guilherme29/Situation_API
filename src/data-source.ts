import "reflect-metadata";
import { DataSource } from "typeorm";

// Importar variáveis de ambiente
import dotenv from 'dotenv';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

    const dialect = process.env.DB_DIALECT;
export const AppDataSource = new DataSource({
    type: dialect as any,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: true,
    entities: [],
    migrations: [__dirname + "/migration/*.js"],
    subscribers: [],
});
    