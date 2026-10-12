// Biblioteca Express

import express from 'express';
import { AppDataSource } from '../data-source';
import { Request, Response } from 'express';
import { User } from '../entity/Users';
import { PaginationService } from '../services/PaginationsServices';

// Criar Aplicação Express
const router = express.Router();

// Criar a rota para listar usuários com paginação
router.get('/users', async (req: Request, res: Response) => {

    try {

        // Obter o repositório da entidade User
        const userRepository = AppDataSource.getRepository(User);

        // Receber o número da página e definir página 1 como padrão
        const page = Number(req.query.page) || 1;

        // Definir o limite de registros por página
        const limit = Number(req.query.limit) || 10;

        // Chamar o serviço de paginação para obter os usuários com as relações de situação
        const result = await PaginationService.paginate(userRepository, page, limit, {id: 'DESC'}, {situation: true});

        // Retornar a resposta com os usuários e informações de paginação
        res.status(200).json(result);
        return

    } catch (error) {

        console.error(error);
        res.status(500).json({
            mensagem: 'Erro ao listar usuários!'
        });
        return

    }
});

// Criar a rota para buscar um usuário pelo ID
router.get('/users/:id', async (req: Request, res: Response) => {

    try {

        const idParam = req.params.id;
        const id = Array.isArray(idParam) ? idParam[0] : idParam;

        // Obter o repositório da entidade User
        const userRepository = AppDataSource.getRepository(User);

        // Buscar o usuário pelo ID com as relações de situação
        const user = await userRepository.findOne({

            where: { id: parseInt(id) },
            relations: {
                situation: true
            }

        });

        // Verificar se o usuário foi encontrado
        if (!user) {
            res.status(404).json({
                mensagem: 'Usuário não encontrado!'
            });
            return
        }

        // Retornar a resposta com o usuário encontrado
        res.status(200).json({
            usuario: user
        });
        return



    } catch (error) {

        console.error(error);
        res.status(500).json({
            mensagem: 'Erro ao buscar usuário!'
        });
        return

    }
});

// Criar a rota para criar um novo usuário
router.post('/users', async (req: Request, res: Response) => {

    try {

        const data = req.body;

        // Obter o repositório da entidade User
        const userRepository = AppDataSource.getRepository(User);

        // Criar um novo usuário
        const newUser = userRepository.create(data);

        // Salvar o novo usuário no banco de dados
        const savedUser = await userRepository.save(newUser);

        // Retornar a resposta com o usuário criado
        res.status(201).json({
            mensagem: 'Usuário criado com sucesso!',
            usuario: savedUser,
        });
        return

    } catch (error) {

        console.error(error);
        res.status(500).json({ 
            mensagem: 'Erro ao criar usuário!' 
        });

    }

});

// Criar a rota para atualizar um usuário existente
router.put('/users/:id', async(req: Request, res: Response) => {

    try {

        // Obter o ID do usuário a ser atualizado
        const idParam = req.params.id;
        // Verificar se o ID é um array e obter o primeiro elemento, caso seja
        const id = Array.isArray(idParam) ? idParam[0] : idParam;

        // Obter os dados do corpo da requisição
        const data = req.body;

        // Obter o repositório da entidade User
        const userRepository = AppDataSource.getRepository(User);

        // Buscar o usuário pelo ID
        const user = await userRepository.findOneBy({ id: parseInt(id) });

        // Verificar se o usuário foi encontrado
        if (!user) {
            res.status(404).json({
                mensagem: 'Usuário não encontrado!'
            });
            return
        }

        // Atualizar os dados do usuário
        userRepository.merge(user, data);

        // Salvar as alterações no banco de dados
        const updatedUser = await userRepository.save(user);

        // Retornar a resposta com o usuário atualizado
        res.status(200).json({
            mensagem: 'Usuário atualizado com sucesso!',
            usuario: updatedUser,
        });
        return

    } catch (error) {

        console.error(error);
        res.status(500).json({
            mensagem: 'Erro ao atualizar usuário!'
        });

    }

});

// Criar a rota para deletar um usuário existente
router.delete('/users/:id', async (req: Request, res: Response) => {

    try {

        // Obter o ID do usuário a ser deletado
        const idParam = req.params.id;
        // Verificar se o ID é um array e obter o primeiro elemento, caso seja
        const id = Array.isArray(idParam) ? idParam[0] : idParam;

        // Obter o repositório da entidade User
        const userRepository = AppDataSource.getRepository(User);

        // Buscar o usuário pelo ID
        const user = await userRepository.findOneBy({ id: parseInt(id) });

        // Verificar se o usuário foi encontrado
        if (!user) {
            res.status(404).json({
                mensagem: 'Usuário não encontrado!'
            });
            return
        }

        // Deletar o usuário do banco de dados
        await userRepository.remove(user);

        // Retornar a resposta de sucesso
        res.status(200).json({
            mensagem: 'Usuário deletado com sucesso!'
        });
        return

    } catch (error) {

        console.error(error);
        res.status(500).json({
            mensagem: 'Erro ao deletar usuário!'
        });
        return

    }
});

// Exportar o roteador
export default router;
