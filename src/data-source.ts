import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/Users";
import { Situation} from "./entity/Situations";


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
    entities: [ User, Situation],
    migrations: [__dirname + "/migration/*.js"],
    subscribers: [],
});

// inicializar conexão com o banco de dados

AppDataSource.initialize().then(() => {
    console.log("Conexão com o banco de dados estabelecida com sucesso!");
}).catch((error) => {
    console.error("Erro ao conectar com o banco de dados:", error);
});