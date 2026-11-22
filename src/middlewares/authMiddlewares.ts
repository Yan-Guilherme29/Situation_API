// Importar o Express
import { Request, Response, NextFunction } from 'express';

// Importar a biblioteca jsonwebtoken para verificar o token JWT
import jwt from 'jsonwebtoken';

// Importar a biblioteca de variáveis de ambiente
import dotenv from 'dotenv';

// Configurar as variáveis de ambiente
dotenv.config();

// Criar a interface Request para receber o id do usuário
interface AuthRequest extends Request {
    user?: {
        id: number;
    }
}

export function verifyToken(req: AuthRequest, res: Response, next: NextFunction): void {
    // Obter o token do cabeçalho da requisição
    const authHeader = req.headers.authorization;

    // Verificar se o token existe
    if (!authHeader) {
        res.status(401).json({
            message: 'Token inválido ou expirado'
        });
        return;
    }

    // Separar o token do tipo Bearer
    const [bearer, token] = authHeader.split(' ');

    // Verificar se o formato do cabeçalho é válido
    if (bearer.toLocaleLowerCase() !== 'bearer' || !token) {
        res.status(401).json({
            message: 'Token inválido!'
        });
        return;
    }

    try {
        // Verificar e decodificar o token usando a chave secreta
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET não configurada');
        }

        const decoded = jwt.verify(token, secret) as { id: number };

        // Adicionar o id do usuário à requisição para uso posterior
        req.user = { id: decoded.id };

        // Passar o controle para a próxima função na rota
        next();
        
    } catch (error) {
        res.status(401).json({
            message: 'Token inválido ou expirado'
        });
    }
}