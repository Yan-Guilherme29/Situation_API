import express from 'express';
import { AppDataSource } from '../data-source';
import { PaginationService } from '../services/PaginationsServices';
import { Request, Response } from 'express';
import { ProductSituation } from '../entity/ProductSituations';

// Criar Aplicação Express
const router = express.Router();


// Criar a rota para listar todas as situações de produtos
router.get('/product-situations', async (req: Request, res: Response) => {

    try {

        // Obter o repositório da entidade ProductSituation
        const productSituationRepository = AppDataSource.getRepository(ProductSituation);

        // Receber o número da página e definir página 1 como padrão
        const page = Number(req.query.page) || 1;

        // Definir o limite de registros por página
        const limit = Number(req.query.limit) || 10;

        const result = await PaginationService.paginate(productSituationRepository, page, limit, { id: 'DESC' });

        // Retornar a resposta com as situações de produtos e informações de paginação
        res.status(200).json(result);
        return

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensagem: 'Erro ao listar situações de produtos!',
        });
        return

    }
});

// Criar a rota para buscar uma situação de produto pelo ID
router.get('/product-situations/:id', async (req: Request, res: Response) => {

    try {   

        const idParam = req.params.id;
        const id = Array.isArray(idParam) ? idParam[0] : idParam;

        // Obter o repositório da entidade ProductSituation
        const productSituationRepository = AppDataSource.getRepository(ProductSituation);

        // Buscar a situação de produto pelo ID
        const productSituation = await productSituationRepository.findOneBy({ id: parseInt(id)});

        // Verificar se a situação de produto foi encontrada
        if (!productSituation) {
            res.status(404).json({
                mensagem: 'Situação de produto não encontrada!',
            });
            return;
        }

        // Retornar a resposta com a situação de produto encontrada
        res.status(200).json({
            situacao: productSituation,
        });
        return

    } catch (error) {

        console.error(error);
        res.status(500).json({
            mensagem: 'Erro ao buscar situação de produto!',

        });
        return
    }

});


// Criar rota para criar uma nova situação de produto
router.post('/product-situations', async (req: Request, res: Response) => {

    try {

        const data = req.body;

        // Obter o repositório da entidade ProductSituation
        const productSituationRepository = AppDataSource.getRepository(ProductSituation);

        // Criar uma nova situação de produto
        const newProductSituation = productSituationRepository.create(data);

        // Salvar a nova situação de produto no banco de dados
        const savedProductSituation = await productSituationRepository.save(newProductSituation);

        // Retornar a resposta com a situação de produto criada
        res.status(201).json({
            mensagem: 'Situação de produto criada com sucesso!',
            situacao: savedProductSituation,
        });
        return

    } catch (error) {

        console.error(error);
        res.status(500).json({
            mensagem: 'Erro ao criar situação de produto!',
        });
    }

});

// Criar rota para atualizar uma situação de produto existente
router.put('/product-situations/:id', async (req: Request, res: Response) => {

    try {

        const idParam = req.params.id;
        const id = Array.isArray(idParam) ? idParam[0] : idParam;

        const data = req.body;

        // Obter o repositório da entidade ProductSituation
        const productSituationRepository = AppDataSource.getRepository(ProductSituation);

        // Buscar a situação de produto pelo ID
        const productSituation = await productSituationRepository.findOneBy({ id: parseInt(id)});

        // Verificar se a situação de produto foi encontrada
        if (!productSituation) {
            res.status(404).json({
                mensagem: 'Situação de produto não encontrada!',
            });
            return;
        }

        // Atualizar a situação de produto
        productSituationRepository.merge(productSituation, data);

        // Salvar as alterações no banco de dados
        const updatedProductSituation = await productSituationRepository.save(productSituation);

        // Retornar a resposta com a situação de produto atualizada
        res.status(200).json({
            mensagem: 'Situação de produto atualizada com sucesso!',
            situacao: updatedProductSituation,
        });
        return;

    } catch (error) {

        console.error(error);
        res.status(500).json({
            mensagem: 'Erro ao atualizar situação de produto!',
        });
    }

});

// Criar rota para deletar uma situação de produto existente
router.delete('/product-situations/:id', async (req: Request, res: Response) => {

    try {

        const idParam = req.params.id;
        const id = Array.isArray(idParam) ? idParam[0] : idParam;

        const productSituationRepository = AppDataSource.getRepository(ProductSituation);

        const productSituation = await productSituationRepository.findOneBy({ id: parseInt(id) });

        if (!productSituation) {
            res.status(404).json({
                mensagem: 'Situação de produto não encontrada!',
            });
            return;
        }

        // Deletar a situação de produto
        await productSituationRepository.remove(productSituation);

        res.status(200).json({
            mensagem: 'Situação de produto deletada com sucesso!',
        });
        return;

    } catch (error) {

        console.error(error);
        res.status(500).json({
            mensagem: 'Erro ao deletar situação de produto!',
        });
    }

});     



// Exportar o roteador
export default router;
