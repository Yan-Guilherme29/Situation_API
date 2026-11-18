// Biblioteca Express

import express from 'express';
import type { Request, Response } from 'express';

// Criar Aplicação Express
const router = express.Router();

// Criar Rota GET principal
router.get('/test-connection', (_request: Request, response: Response) => {
    response.status(200).json({ message: "Conexão com a API realizada com sucesso! Tela de Teste de Conexão da Rota!" });
});

// Exportar o roteador
export default router;