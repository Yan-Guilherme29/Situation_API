// Biblioteca Express

import express from 'express';
import type { Request, Response } from 'express';

// importar o DataSource do TypeORM\
import { AppDataSource } from "../data-source.js";

// Criar Aplicação Express
const router = express.Router();

// inicializar conexão com o banco de dados
AppDataSource.initialize().then(() => {
    console.log("Conexão com o banco de dados estabelecida com sucesso!");
}).catch((error) => {
    console.error("Erro ao conectar com o banco de dados:", error);
});

// Criar Rota GET principal
router.get('/', (_request: Request, response: Response) => {
    response.json({ message: 'API funcionando! Tela de Login da Rota!' });
});

// Exportar o roteador
export default router;