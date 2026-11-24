
import express from 'express';
import type { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { ErrorMappingService } from '../services/ErrorMappingService';
import * as yup from 'yup';
import { AppDataSource } from '../data-source';
import { User } from '../entity/Users';
import crypto, { verify } from "crypto";
import nodemailer from 'nodemailer';
import { verifyToken } from '../middlewares/authMiddlewares';

// Criar Aplicação Express
const router = express.Router();

// Criar Rota POST principal
router.post('/login', async (req: Request, res: Response) => {
    try {

        //Extrair email e senha do corpo da requisição
        const { email, password } = req.body;

        // Verificar se o email e a senha foram fornecidos
        if (!email || !password) {
            res.status(400).json({
                message: 'Email e senha são obrigatórios!'
            });
            return;
        }

        // Criar instância do serviço de autenticação
        const authService = new AuthService();

        // Chamar o método de login do serviço de autenticação
        const userData = await authService.login(email, password);

        res.status(200).json({
            message: 'Login realizado com sucesso!',
            user: userData
        });
        return;

    } catch (error: any) {
        res.status(401).json({
            message: 'Erro ao realizar login!'
        });
        return;

    }

});

// Criar rota para validar Token
router.get("/validate-token", verifyToken, async (req: Request, res: Response)=> {
    res.status(200).json({
        message: "Token válido!",
        userId: (req as any).user.id
    });

});

// Rota pública para cadastro de usuários
router.post('/new-users', async (req: Request, res: Response) => {

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

// Rota para recuperar senha
router.post("/recover-password", async (req: Request, res: Response) => {

    try {

        var data = req.body

        // Validar dados recebidos usando Yup
        const schema = yup.object().shape({
            email: yup.string().email('O e-mail deve ser válido.').required('O e-mail é obrigatório.'),
            urlRecoverPassword: yup.string().required("O campo URL é obrigatório!")
        });

        // Validar os dados recebidos
        await schema.validate(data, { abortEarly: false });

        // Obter o repositório da entidade User
        const userRepository = AppDataSource.getRepository(User);

        // Recuperar o registro do banco de dados com o valor da coluna email
        const user = await userRepository.findOneBy({ email: data.email });

        // Verificar se já existe um usuário com o mesmo e-mail
        if (!user) {
            res.status(404).json({
                mensagem: 'Usuário não encontrado!'
            });
            return
        }

        // Gera um token seguro de 64 caracteres
        user.recoverPassword = crypto.randomBytes(32).toString("hex");

        // Salvar as alterações no banco de dados
        await userRepository.save(user);

        // Criar a variável com as credenciais do servidor para enviar o e-mail
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Criar a variável com o conteúdo do e-mail
        var message_content = {
            from: process.env.EMAIL_FROM,
            to: data.email,
            subject: "Recuperar senha",
            text: "teste",
            html: "teste"

        }

        transporter.sendMail(message_content, function (err) {
            if (err) {
                console.log("Erro ao enviar email", err);
                res.status(500).json({
                    message: `E-mail não enviado, tente novamente!`,
                });
                return;
            } else {
                res.status(200).json({
                    message: "Email enviado! Verifique sua caixa de entrada!"
                });
                return;
            }
        });

    } catch (error: any) {

        if (error instanceof yup.ValidationError) {
            res.status(400).json({
                message: error.errors
            });
            return;
        }

        console.error(error);
        // Mapear o erro para uma resposta adequada
        const { status, message } = ErrorMappingService.mapErrorToResponse(error, 'usuário');
        res.status(status).json({ mensagem: message });

    }

});

router.post("/validate-recover-password", async (req: Request, res: Response) => {

    try {

        var data = req.body

        // Validar dados recebidos usando Yup
        const schema = yup.object().shape({
            email: yup.string().email('O e-mail deve ser válido.').required('O e-mail é obrigatório.'),
            recoverPassword: yup.string().required("A chave é obrigatória!")
        });

        // Validar os dados recebidos
        await schema.validate(data, { abortEarly: false });

        // Obter o repositório da entidade User
        const userRepository = AppDataSource.getRepository(User);

        // Recuperar o registro do banco de dados com o valor da coluna email
        const user = await userRepository.findOneBy({ email: data.email, recoverPassword: data.recoverPassword });


        if (!user) {
            res.status(404).json({
                mensagem: 'A chave recuperar senha é inválida!'
            });
            return
        }

        res.status(200).json({
            message: "A chave recuperar senha é válida!"
        })

    } catch (error: any) {

        if (error instanceof yup.ValidationError) {
            res.status(400).json({
                message: error.errors
            });
            return;
        }

        res.status(404).json({
            mensagem: 'A chave recuperar senha é inválida!'
        });


    }

});

router.put("/update-password", async (req: Request, res: Response) => {

    try {
        var data = req.body

        // Validar dados recebidos usando Yup
        const schema = yup.object().shape({
            email: yup.string().email('O e-mail deve ser válido.').required('O e-mail é obrigatório.'),
            recoverPassword: yup.string().required("A chave é obrigatória!"),
            password: yup.string().required('A senha é obrigatória.').min(6, 'A senha deve ter pelo menos 6 caracteres.'),
        });

        // Validar os dados recebidos
        await schema.validate(data, { abortEarly: false });

        // Obter o repositório da entidade User
        const userRepository = AppDataSource.getRepository(User);

        // Recuperar o registro do banco de dados com o valor da coluna email
        const user = await userRepository.findOneBy({ email: data.email, recoverPassword: data.recoverPassword });

        // Verificar se já existe um usuário com o mesmo e-mail
        if (!user) {
            res.status(404).json({
                mensagem: 'A chave para recuperar senha é inválida!'
            });
            return
        }

        // Atualizar os dados apenas de password e recoverPassword do usuário
        userRepository.merge(user, {
            password: data.password,
            recoverPassword: null as unknown as string
        });

        // Salvar alterações no banco de dados
        await userRepository.save(user)

        res.status(200).json({
            message: "Senha atual atualizada com sucesso!"
        });
        return;



    } catch (error: any) {

        if (error instanceof yup.ValidationError) {
            res.status(400).json({
                message: error.errors
            });
            return;
        }

        res.status(500).json({
            mensagem: 'A chave recuperar senha é inválida!'
        });
    }
});




// Exportar o roteador
export default router;