// Biblioteca Express

import express from 'express';
import { AppDataSource } from '../data-source';
import { Request, Response } from 'express';
import { Product } from '../entity/Products';
import { PaginationService } from '../services/PaginationsServices';

// Criar Aplicação Express
const router = express.Router();

// Criar a rota para listar produtos com paginação
router.get('/products', async (req: Request, res: Response) => {

    try {

        // Obter o repositório da entidade Product
        const productRepository = AppDataSource.getRepository(Product);

        // Receber o número da página e definir página 1 como padrão
        const page = Number(req.query.page) || 1;

        // Definir o limite de registros por página
        const limit = Number(req.query.limit) || 10;

        // Chamar o serviço de paginação para obter os produtos com as relações de categoria e situação
        const result = await PaginationService.paginate(productRepository, page, limit, {id: 'DESC'}, {category: true, situation: true});

        // Retornar a resposta com os produtos e informações de paginação
        res.status(200).json(result);
        return

    } catch (error) {

        console.error(error);
        res.status(500).json({
            mensagem: 'Erro ao listar produtos!'
        });
        return

    }
});

// Criar a rota para criar um novo produto
router.post('/products', async (req: Request, res: Response) => {

    try {

        const data = req.body;

        // Obter o repositório da entidade Product
        const productRepository = AppDataSource.getRepository(Product);

        // Criar um novo produto
        const newProduct = productRepository.create(data);

        // Salvar o novo produto no banco de dados
        const savedProduct = await productRepository.save(newProduct);

        // Retornar a resposta com o produto criado
        res.status(201).json({
            mensagem: 'Produto criado com sucesso!',
            produto: savedProduct,
        });
        return

    } catch (error) {

        console.error(error);
        res.status(500).json({ 
            mensagem: 'Erro ao criar produto!' 
        });

    }

});


// Exportar o roteador
export default router;
