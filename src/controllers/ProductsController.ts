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

// Criar a rota para buscar um produto pelo ID
router.get('/products/:id', async (req: Request, res: Response) => {

    try {

        const idParam = req.params.id;
        const id = Array.isArray(idParam) ? idParam[0] : idParam;

        // Obter o repositório da entidade Product
        const productRepository = AppDataSource.getRepository(Product);

        // Buscar o produto pelo ID com as relações de categoria e situação
        const product = await productRepository.findOne({

            where: { id: parseInt(id) },
            relations: {
                category: true,
                situation: true
            }

        });

        // Verificar se o produto foi encontrado
        if (!product) {
            res.status(404).json({
                mensagem: 'Produto não encontrado!'
            });
            return
        }

        // Retornar a resposta com o produto encontrado
        res.status(200).json({
            produto: product
        });
        return



    } catch (error) {

        console.error(error);
        res.status(500).json({
            mensagem: 'Erro ao buscar produto!'
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

// Criar a rota para atualizar um produto existente
router.put('/products/:id', async(req: Request, res: Response) => {

    try {

        // Obter o ID do produto a ser atualizado
        const idParam = req.params.id;
        // Verificar se o ID é um array e obter o primeiro elemento, caso seja
        const id = Array.isArray(idParam) ? idParam[0] : idParam;

        // Obter os dados do corpo da requisição
        const data = req.body;

        // Obter o repositório da entidade Product
        const productRepository = AppDataSource.getRepository(Product);

        // Buscar o produto pelo ID
        const product = await productRepository.findOneBy({ id: parseInt(id) });

        // Verificar se o produto foi encontrado
        if (!product) {
            res.status(404).json({
                mensagem: 'Produto não encontrado!'
            });
            return
        }

        // Atualizar os dados do produto
        productRepository.merge(product, data);

        // Salvar as alterações no banco de dados
        const updatedProduct = await productRepository.save(product);

        // Retornar a resposta com o produto atualizado
        res.status(200).json({
            mensagem: 'Produto atualizado com sucesso!',
            produto: updatedProduct,
        });
        return

    } catch (error) {

        console.error(error);
        res.status(500).json({
            mensagem: 'Erro ao atualizar produto!'
        });

    }

});

// Criar a rota para deletar um produto existente
router.delete('/products/:id', async (req: Request, res: Response) => {

    try {

        // Obter o ID do produto a ser deletado
        const idParam = req.params.id;
        // Verificar se o ID é um array e obter o primeiro elemento, caso seja
        const id = Array.isArray(idParam) ? idParam[0] : idParam;

        // Obter o repositório da entidade Product
        const productRepository = AppDataSource.getRepository(Product);

        // Buscar o produto pelo ID
        const product = await productRepository.findOneBy({ id: parseInt(id) });

        // Verificar se o produto foi encontrado
        if (!product) {
            res.status(404).json({
                mensagem: 'Produto não encontrado!'
            });
            return
        }

        // Deletar o produto do banco de dados
        await productRepository.remove(product);

        // Retornar a resposta de sucesso
        res.status(200).json({
            mensagem: 'Produto deletado com sucesso!'
        });
        return

    } catch (error) {

        console.error(error);
        res.status(500).json({
            mensagem: 'Erro ao deletar produto!'
        });
        return

    }
});

// Exportar o roteador
export default router;
