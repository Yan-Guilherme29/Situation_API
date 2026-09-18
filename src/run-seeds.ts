import { AppDataSource } from "./data-source";
import CreateSituationsSeeds from "./seeds/CreateSituationsSeeds";

const runSeeds = async () => {
    console.log("Conectando ao banco de dados...");

    await AppDataSource.initialize();
    console.log("Conexão com o banco de dados estabelecida com sucesso!");

    try {

        // Criar instância da classe CreateSituationsSeeds
        const situationsSeeds = new CreateSituationsSeeds();

        // Executa as seeds de situações
        await situationsSeeds.run(AppDataSource);

    }

    catch (error) {
        console.error("Erro ao executar as seeds:", error);

    } finally {
        await AppDataSource.destroy();
        console.log("Conexão com o banco de dados encerrada.");
    }
};

runSeeds();