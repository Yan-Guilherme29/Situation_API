// Biblioteca Express
import express from 'express';
import type { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

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

// Exportar o roteador
export default router;