// Biblioteca Express

import express from 'express';
import { AppDataSource } from '../data-source';
import { PaginationService } from '../services/PaginationsServices';
import { Request, Response } from 'express';
import { ProductCategory } from '../entity/ProductCategories';


// Criar Aplicação Express
const router = express.Router();

router.get('/product-categories', async (req: Request, res: Response) => {

    try {

        // Obter o repositório da entidade ProductCategory
        const productCategoryRepository = AppDataSource.getRepository(ProductCategory);

        // Receber o número da página e definir página 1 como padrão
        const page = Number(req.query.page) || 1;

        // Definir o limite de registros por página
        const limit = Number(req.query.limit) || 10;

        const result = await PaginationService.paginate(productCategoryRepository, page, limit, { id: 'DESC' });

        // Retornar a resposta com as categorias de produtos e informações de paginação
        res.status(200).json(result);
        return

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensagem: 'Erro ao listar categorias de produtos!',
        });
        return

    }
});



// Exportar o roteador
export default router;

