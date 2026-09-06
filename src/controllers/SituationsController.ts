// Biblioteca Express

import express, { request } from 'express';
import type { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Situation } from '../entity/Situations';

// Criar Aplicação Express
const router = express.Router();

// Criar a rota para listar todas as situações
router.get('/situations', async (req: Request, res: Response) => {

    try {
        const SituationRepository = AppDataSource.getRepository(Situation);
        const situations = await SituationRepository.find();

        res.status(200).json(situations);
        return

    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao listar situações!',
        });
        return
    }

});

// Criar a rota para buscar uma situação pelo ID
router.get('/situations/:id', async (req: Request, res: Response) => {

    try {

        const idParam = req.params.id;
        const id = Array.isArray(idParam) ? idParam[0] : idParam;

        const SituationRepository = AppDataSource.getRepository(Situation);

        const situations = await SituationRepository.findOneBy({ id: parseInt(id) });

        if (!situations) {
            res.status(404).json({
                mensagem: 'Situação não encontrada!',
            });
            return

        }

        res.status(200).json(situations);
        return

    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao buscar situação!',
        });
        return
    }

});


// Criar a rota para criar uma nova situação
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