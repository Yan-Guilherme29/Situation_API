// Biblioteca Express

import express from 'express';
import { AppDataSource } from '../data-source';
import { PaginationService } from '../services/PaginationsServices';
import { Request, Response } from 'express';
import { ProductCategory } from '../entity/ProductCategories';


// Criar Aplicação Express
const router = express.Router();

// Criar a rota para listar todas as categorias de produtos
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

// Criar a rota para buscar uma categoria de produto pelo ID
router.get('/product-categories/:id', async (req: Request, res: Response) => {

    try {   

        const idParam = req.params.id;
        const id = Array.isArray(idParam) ? idParam[0] : idParam;

        // Obter o repositório da entidade ProductCategory
        const productCategoryRepository = AppDataSource.getRepository(ProductCategory);

        // Buscar a categoria de produto pelo ID
        const productCategory = await productCategoryRepository.findOneBy({ id: parseInt(id)});

        // Verificar se a categoria de produto foi encontrada
        if (!productCategory) {
            res.status(404).json({
                mensagem: 'Categoria de produto não encontrada!',
            });
            return;
        }

        // Retornar a resposta com a categoria de produto encontrada
        res.status(200).json({
            categoria: productCategory,
        });
        return

    } catch (error) {

        console.error(error);
        res.status(500).json({
            mensagem: 'Erro ao buscar categoria de produto!',

        });
        return
    }

});


// Criar rota para criar uma nova categoria de produto
router.post('/product-categories', async (req: Request, res: Response) => {

    try {

        const data = req.body;

        // Obter o repositório da entidade ProductCategory
        const productCategoryRepository = AppDataSource.getRepository(ProductCategory);
        
        // Criar uma nova categoria de produto
        const newProductCategory = productCategoryRepository.create(data);

        // Salvar a nova categoria de produto no banco de dados
        const savedProductCategory = await productCategoryRepository.save(newProductCategory);

        // Retornar a resposta com a categoria de produto criada
        res.status(201).json({
            mensagem: 'Categoria de produto criada com sucesso!',
            categoria: savedProductCategory,
        });
        return

    } catch (error) {

        console.error(error);
        res.status(500).json({
            mensagem: 'Erro ao criar categoria de produto!',
        });
    }

});

// Exportar o roteador
export default router;

