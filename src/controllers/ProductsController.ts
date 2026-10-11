// Biblioteca Express

import express from 'express';
import { AppDataSource } from '../data-source';
import { Request, Response } from 'express';
import { Product } from '../entity/Products';

// Criar Aplicação Express
const router = express.Router();

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
