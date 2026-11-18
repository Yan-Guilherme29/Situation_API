// Biblioteca Express

import express from 'express';
import type { Request, Response } from 'express';

// Criar Aplicação Express
const router = express.Router();

// Criar Rota GET principal
router.get('/', (_request: Request, response: Response) => {
    response.send("API funcionando! Tela de Login da Rota!");
});

// Exportar o roteador
export default router;