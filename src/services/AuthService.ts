// Importar a conexão com o banco de dados
import { AppDataSource } from "../data-source";
import { User } from "../entity/Users";
import jwt from 'jsonwebtoken';

// Importar variáveis de ambiente
import dotenv from 'dotenv';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();


// Classe de serviço de autenticação
export class AuthService {
    // Criar repositório para a entidade User
    private userRepository = AppDataSource.getRepository(User);

    async login(email: string, password: string): Promise<{id: number; name: string; email: string; token: string}> {
        
        // Buscar usuário pelo email
        const user = await this.userRepository.findOne({ where: { email } });

        // Se o usuário não for encontrado, lançar um erro
        if (!user) {
            throw new Error("Usuário ou senha inválidos!");
        }

        // Verificar se a senha fornecida corresponde à senha armazenada no banco de dados
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new Error("Usuário ou senha inválidos!");
        }

        // Gerar um token JWT para o usuário autenticado
        // Token inclui o ID do usuário autenticado e expira em 7 dias
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
        // Retornar os dados do usuário autenticado junto com o token
        return { id: user.id, name: user.name, email: user.email, token };
    }
}