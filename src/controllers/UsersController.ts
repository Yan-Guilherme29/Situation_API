
import express from 'express';
import { AppDataSource } from '../data-source';
import { Request, Response } from 'express';
import { User } from '../entity/Users';
import { PaginationService } from '../services/PaginationsServices';
import { ErrorMappingService } from '../services/ErrorMappingService';
import * as yup from 'yup';
import { Not } from 'typeorm';
import bcrypt from 'bcryptjs';
import { verifyToken } from '../middlewares/authMiddlewares';
import { Situation } from '../entity/Situations';

// Criar Aplicação Express
const router = express.Router();

// Criar a rota para listar usuários com paginação
router.get('/users', verifyToken, async (req: Request, res: Response) => {

    try {

        // Obter o repositório da entidade User
        const userRepository = AppDataSource.getRepository(User);

        // Receber o número da página e definir página 1 como padrão
        const page = Number(req.query.page) || 1;

        // Definir o limite de registros por página
        const limit = Number(req.query.limit) || 10;

        // Chamar o serviço de paginação para obter os usuários com as relações de situação
        const result = await PaginationService.paginate(userRepository, page, limit, { id: 'DESC' }, { situation: true });

        // Retornar a resposta com os usuários e informações de paginação
        res.status(200).json(result);
        return

    } catch (error) {

        console.error(error);
        // Mapear o erro para uma resposta adequada
        const { status, message } = ErrorMappingService.mapErrorToResponse(error, 'usuário');
        res.status(status).json({ mensagem: message });
        return

    }
});

// Criar a rota para buscar um usuário pelo ID
router.get('/users/:id', verifyToken, async (req: Request, res: Response) => {

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
        // Mapear o erro para uma resposta adequada
        const { status, message } = ErrorMappingService.mapErrorToResponse(error, 'usuário');
        res.status(status).json({ mensagem: message });
        return

    }
});

// Criar a rota para criar um novo usuário
router.post('/users', verifyToken, async (req: Request, res: Response) => {

    try {

        const data = req.body;

        // Validar dados recebidos usando Yup
        const schema = yup.object().shape({
            name: yup.string().required('O nome é obrigatório.').min(3, 'O nome deve ter pelo menos 3 caracteres.'),
            email: yup.string().email('O e-mail deve ser válido.').required('O e-mail é obrigatório.'),
            password: yup.string().required('A senha é obrigatória.').min(6, 'A senha deve ter pelo menos 6 caracteres.'),
            situation: yup.number().required('O ID da situação é obrigatório.')
        });

        // Validar os dados recebidos
        await schema.validate(data, { abortEarly: false });

        // Obter o repositório da entidade User
        const userRepository = AppDataSource.getRepository(User);

        // Recuperar o usuário existente com o mesmo e-mail, se houver
        const existingUser = await userRepository.findOneBy({ email: data.email });

        // Verificar se já existe um usuário com o mesmo e-mail
        if (existingUser) {
            res.status(400).json({
                mensagem: 'Já existe um usuário com este e-mail.'
            });
            return
        }

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

        if (error instanceof yup.ValidationError) {
            // Se for um erro de validação do Yup, retornar os erros de validação
            const validationErrors = error.inner.map(err => ({
                mensagem: err.message,
            }));

            // Retornar a resposta com os erros de validação
            res.status(400).json({ erros: validationErrors });
            return
        }

        console.error(error);
        // Mapear o erro para uma resposta adequada
        const { status, message } = ErrorMappingService.mapErrorToResponse(error, 'usuário');
        res.status(status).json({ mensagem: message });

    }

});

// Atualiza a senha do usuário informado após validar os dados recebidos.
router.put('/users-password/:id', verifyToken, async (req: Request, res: Response) => {
    try {
        // Obter o ID do usuário a ser atualizado
        const idParam = req.params.id;
        const id = Array.isArray(idParam) ? idParam[0] : idParam;

        // Obter os dados do corpo da requisição
        const data = req.body;

        // Validar dados recebidos usando Yup
        const schema = yup.object().shape({
            password: yup.string().required('A senha é obrigatória.').min(6, 'A senha deve ter pelo menos 6 caracteres.'),
        });

        // Validar os dados recebidos
        await schema.validate(data, { abortEarly: false });

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

        user.password = await bcrypt.hash(data.password, 10);

        // Salvar as alterações no banco de dados
        const updatedUser = await userRepository.save(user);

        // Retornar a resposta com o usuário atualizado
        res.status(200).json({
            mensagem: 'Senha do usuário atualizada com sucesso!',
            usuario: updatedUser,
        });
        return

    } catch (error) {

        if (error instanceof yup.ValidationError) {
            // Se for um erro de validação do Yup, retornar os erros de validação
            const validationErrors = error.inner.map(err => ({
                mensagem: err.message,
            }));

            // Retornar a resposta com os erros de validação
            res.status(400).json({ erros: validationErrors });
            return
        }

        console.error(error);
        // Mapear o erro para uma resposta adequada
        const { status, message } = ErrorMappingService.mapErrorToResponse(error, 'usuário');
        res.status(status).json({ mensagem: message });

    }

});

// Criar a rota para atualizar um usuário existente
router.put('/users/:id', verifyToken, async (req: Request, res: Response) => {

    try {

        // Obter o ID do usuário a ser atualizado
        const idParam = req.params.id;
        // Verificar se o ID é um array e obter o primeiro elemento, caso seja
        const id = Array.isArray(idParam) ? idParam[0] : idParam;

        // Obter os dados do corpo da requisição
        const data = req.body;

        // Validar dados recebidos usando Yup
        const schema = yup.object().shape({
            name: yup.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
            email: yup.string().email('O e-mail deve ser válido.'),
            situationId: yup.number(),
        });

        // Validar os dados recebidos
        await schema.validate(data, { abortEarly: false });

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

        if (data.email) {
            const existingUserWithEmail = await userRepository.findOneBy({
                email: data.email,
                id: Not(parseInt(id))
            });

            if (existingUserWithEmail) {
                res.status(400).json({
                    mensagem: 'Já existe outro usuário com este e-mail.'
                });
                return;
            }
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

        if (error instanceof yup.ValidationError) {
            // Se for um erro de validação do Yup, retornar os erros de validação
            const validationErrors = error.inner.map(err => ({
                mensagem: err.message,
            }));

            // Retornar a resposta com os erros de validação
            res.status(400).json({ erros: validationErrors });
            return
        }

        console.error(error);
        // Mapear o erro para uma resposta adequada
        const { status, message } = ErrorMappingService.mapErrorToResponse(error, 'usuário');
        res.status(status).json({ mensagem: message });

    }

});

// Criar a rota para deletar um usuário existente
router.delete('/users/:id', verifyToken, async (req: Request, res: Response) => {

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
        // Mapear o erro para uma resposta adequada
        const { status, message } = ErrorMappingService.mapErrorToResponse(error, 'usuário');
        res.status(status).json({ mensagem: message });
        return

    }
});

// Exportar o roteador
export default router;