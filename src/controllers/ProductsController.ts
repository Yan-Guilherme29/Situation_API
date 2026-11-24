// Biblioteca Express

import express from 'express';
import { AppDataSource } from '../data-source';
import { Request, Response } from 'express';
import { Product } from '../entity/Products';
import { PaginationService } from '../services/PaginationsServices';
import { ErrorMappingService } from '../services/ErrorMappingService';
import * as yup from 'yup';
import slugify from 'slugify';
import { Not } from 'typeorm';

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
        const result = await PaginationService.paginate(productRepository, page, limit, { id: 'DESC' }, { situation: true, category: true });

        // Retornar a resposta com os produtos e informações de paginação
        res.status(200).json(result);
        return

    } catch (error) {

        console.error(error);
        // Mapear o erro para uma resposta adequada
        const { status, message } = ErrorMappingService.mapErrorToResponse(error, 'produto');
        res.status(status).json({ mensagem: message });
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

            relations: { situation: true, category: true },
            where: { id: parseInt(id) },

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
        // Mapear o erro para uma resposta adequada
        const { status, message } = ErrorMappingService.mapErrorToResponse(error, 'produto');
        res.status(status).json({ mensagem: message });
        return

    }
});

// Criar a rota para criar um novo produto
router.post('/products', async (req: Request, res: Response) => {

    try {

        const data = req.body;

        const schema = yup.object().shape({
            name: yup
            .string()
            .required('O nome do produto é obrigatório.')
            .min(3, 'O nome do produto deve ter no mínimo 3 caracteres.')
            .max(255, 'O nome do produto deve ter no máximo 255 caracteres.'),

            slug: yup
            .string()
            .required('O slug do produto é obrigatório.')
            .min(3, 'O slug do produto deve ter no mínimo 3 caracteres.')
            .max(255, 'O slug do produto deve ter no máximo 255 caracteres.'),

            situation: yup
            .number()
            .typeError('A situação do produto deve ser um número.')
            .required('A situação do produto é obrigatória.')
            .positive('A situação do produto deve ser um número positivo.'),

        });

        // Validar os dados recebidos
        await schema.validate(data, { abortEarly: false });

        // Gerar slug automaticamente com base no nome do produto, caso não seja fornecido
        data.slug = slugify(data.slug, { lower: true, strict: true });

        // Obter o repositório da entidade Product
        const productRepository = AppDataSource.getRepository(Product);

        // Recuperar o registro do banco de dados com o valor da coluna slug
        const existingProduct = await productRepository.findOneBy({ slug: data.slug });

        // Verificar se o produto já existe
        if (existingProduct) {
            res.status(409).json({
                mensagem: 'Já existe um produto com esse slug!'
            });
            return
        }

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

        if (error instanceof yup.ValidationError) {
            // Retornar os erros de validação
            res.status(400).json({
                mensagem: 'Erro de validação.',
                erros: error.errors,
            });
            return
        }

        console.error(error);
        // Mapear o erro para uma resposta adequada
        const { status, message } = ErrorMappingService.mapErrorToResponse(error, 'produto');
        res.status(status).json({ mensagem: message });

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

        // Validar os dados recebidos com yup
        const schema = yup.object().shape({
            name: yup
            .string()
            .required('O nome do produto é obrigatório.')
            .min(3, 'O nome do produto deve ter no mínimo 3 caracteres.')
            .max(255, 'O nome do produto deve ter no máximo 255 caracteres.'),

            slug: yup
            .string()
            .required('O slug do produto é obrigatório.')
            .min(3, 'O slug do produto deve ter no mínimo 3 caracteres.')
            .max(255, 'O slug do produto deve ter no máximo 255 caracteres.'),

            situation: yup
            .number()
            .typeError('A situação do produto deve ser um número.')
            .required('A situação do produto é obrigatória.')
            .positive('A situação do produto deve ser um número positivo.'),

        });

        // Validar os dados recebidos
        await schema.validate(data, { abortEarly: false });

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

        // Gerar slug automaticamente com base no nome do produto, caso não seja fornecido
        data.slug = slugify(data.slug, { lower: true, strict: true });

        // Recuperar o registro do banco de dados com o valor da coluna slug
        const existingProduct = await productRepository.findOneBy({ slug: data.slug, id: Not(parseInt(id)) });

        // Verificar se o slug já está em uso por outro produto
        if (existingProduct) {
            res.status(409).json({
                mensagem: 'O slug do produto já está em uso!'
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

        if (error instanceof yup.ValidationError) {
            // Retornar os erros de validação
            res.status(400).json({
                mensagem: 'Erro de validação.',
                erros: error.errors,
            });
            return
        }

        console.error(error);
        // Mapear o erro para uma resposta adequada
        const { status, message } = ErrorMappingService.mapErrorToResponse(error, 'produto');
        res.status(status).json({ mensagem: message });

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
        // Mapear o erro para uma resposta adequada
        const { status, message } = ErrorMappingService.mapErrorToResponse(error, 'produto');
        res.status(status).json({ mensagem: message });
        return

    }
});

// Exportar o roteador
export default router;