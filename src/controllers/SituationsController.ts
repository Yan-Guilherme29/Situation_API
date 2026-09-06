// Biblioteca Express

import express, { request } from 'express';
import type { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Situation } from '../entity/Situations';

// Criar Aplicação Express
const router = express.Router();

// Criar Rota GET principal
router.get('/situations', (_request: Request, response: Response) => {
    response.send('API funcionando! Tela de situations da Rota!');
});

// Criar Rota Post
router.post('/situations', async (req: Request, res: Response) => {

    try {
        var data = req.body;

        const SituationRepository = AppDataSource.getRepository(Situation);

        const newSituation = SituationRepository.create(data);
        
        await SituationRepository.save(newSituation);

        res.status(201).json({
            mensagem: 'Situação criada com sucesso!',
            situation: newSituation,
        });
    

    } catch (error) {

        res.status(500).json({
            mensagem: 'Erro ao criar situação!',
        });
    }

});


// Exportar o roteador
export default router;