
import express from 'express';
import type { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { ErrorMappingService } from '../services/ErrorMappingService';
import * as yup from 'yup';
import { AppDataSource } from '../data-source';
import { User } from '../entity/Users';
import crypto from "crypto";
import nodemailer from 'nodemailer';

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

})

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
                res.status(200).json({
                    message: `E-mail não enviado, tente novamente!`,
                });
                return;
            } else {
                res.status(200).json({
                    message: "Email enviado! Verifique sua caixa de entrada!",
                    urlRecoverPassword: `${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}`,
                });
                return;
            }
        });



        // Retornar resposta de sucesso
        res.status(200).json({
            message: "Gerado o link para recuperar a senha!",
            urlRecoverPassword: `${data.urlRecoverPassword}?email=${data.email}&key=${user.recoverPassword}`,
            key: user.recoverPassword
        })



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

// Exportar o roteador
export default router;