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

        // Obter o repositório da entidade Situation
        const situationRepository = AppDataSource.getRepository(Situation);

        // Receber o número da página e definir página 1 como padrão
        const page = Number(req.query.page) || 1;

        // Definir o limite de registros por página
        const limit = 1;

        // Contatar o total de registros no banco de dados
        const totalSituations = await situationRepository.count();

        // Verificar se existem registros no banco de dados
        if (totalSituations === 0) {
            res.status(400).json({
                mensagem: 'Nenhuma situação encontrada!',
            });
            return
        }
        
        // Calcular a última página
        const ultimaPagina = Math.ceil(totalSituations / limit);

        // Verificar se a página solicitada é válida
        if(page > ultimaPagina) {
            res.status(400).json({
                mensagem: `Página inválida! O total de páginas é ${ultimaPagina}.`,
            });
            return
        }

        // Calcular o offset (a partir de qual registro começar a buscar)
        const offset = (page - 1) * limit;
    

        // Receber as situações do banco de dados com paginação
        const situations = await situationRepository.find({
            skip: offset,
            take: limit,
            order: {
                id: 'DESC',
            },
        });

        // Retornar a resposta com as situações e informações de paginação
        res.status(200).json(
            {
                currentPage: page,
                ultimaPagina,
                totalSituations,
                situations
            }
        );
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

// Criar a rota para atualizar uma situação existente
router.put('/situations/:id', async (req: Request, res: Response) => {

    try {

        const idParam = req.params.id;
        const id = Array.isArray(idParam) ? idParam[0] : idParam;

        var data = req.body;

        const SituationRepository = AppDataSource.getRepository(Situation);

        const situation = await SituationRepository.findOneBy({ id: parseInt(id) });

        if (!situation) {
            res.status(404).json({
                mensagem: 'Situação não encontrada!',
            });
            return
        }

        // Atualiza os dados da situação
        SituationRepository.merge(situation, data);

        // Salvar as alterações de dados
        const updatedSituation = await SituationRepository.save(situation);

        res.status(200).json({
            mensagem: 'Situação atualizada com sucesso!',
            situation: updatedSituation,
        });

    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao atualizar situação!',
        });
    }

});

// Criar a rota para deletar uma situação existente
router.delete('/situations/:id', async (req: Request, res: Response) => {

    try {

        const idParam = req.params.id;
        const id = Array.isArray(idParam) ? idParam[0] : idParam;

        const SituationRepository = AppDataSource.getRepository(Situation);

        const situation = await SituationRepository.findOneBy({ id: parseInt(id) });

        if (!situation) {
            res.status(404).json({
                mensagem: 'Situação não encontrada!',
            });
            return
        }

        // Deletar a situação
        await SituationRepository.remove(situation);

        res.status(200).json({
            mensagem: 'Situação deletada com sucesso!',
        });

    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao deletar situação!',
        });
    }

});

// Exportar o roteador
export default router;