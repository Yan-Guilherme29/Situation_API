// Importar a conexão com o banco de dados
import { AppDataSource } from '../data-source';
import { DataSource } from 'typeorm';

// Importar bcrypt para criptografia de senhas
import bcrypt from 'bcryptjs';

// Importar a entidade User
import { User } from '../entity/Users';
import { Situation } from '../entity/Situations';

export default class CreateUsersSeeds {
    public async run(dataSource: DataSource): Promise<void> {

        console.log('Iniciando a criação de usuários...');

        // Obter o repositório de usuários e situações
        const userRepository = dataSource.getRepository(User);
        const situationRepository = dataSource.getRepository(Situation);

        // Verificar se já existem usuários no banco de dados

        const existingUsers = await userRepository.find();
        if (existingUsers.length > 0) {
            console.log('Usuários já existem no banco de dados. Nenhum usuário será criado.');
            return;
        }

        // Buscar todas as situações existentes no banco de dados
        const situations = await situationRepository.find();

        // Verificar se existem situações no banco de dados
        if (!situations || situations.length === 0) {
            console.log('Nenhuma situação encontrada no banco de dados. Nenhum usuário será criado.');
            return;
        }

        // Criar usuários com base nas situações existentes

        const users = [
            {
                id: 1,
                name: 'Admin User',
                email: 'admin@example.com',
                password: await bcrypt.hash('adminpassword', 10),
                situation: situations[0], 
            }
        ];

        // Salvar os registros no banco de dados
        await userRepository.save(users);

        console.log('Usuários criados com sucesso!');
    }
}