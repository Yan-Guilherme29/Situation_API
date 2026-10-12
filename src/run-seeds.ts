import { AppDataSource } from "./data-source";
import CreateSituationsSeeds from "./seeds/CreateSituationsSeeds";
import CreateProductCategoriesSeeds from "./seeds/CreateProductCategoriesSeeds";
import CreateProductSituationsSeeds from "./seeds/CreateProductSituationsSeeds";

const runSeeds = async () => {
    console.log("Conectando ao banco de dados...");

    await AppDataSource.initialize();
    console.log("Conexão com o banco de dados estabelecida com sucesso!");

    try {

        // Criar instância da classe CreateSituationsSeeds
        const situationsSeeds = new CreateSituationsSeeds();

        // Criar instância da classe CreateProductCategoriesSeeds
        const productCategoriesSeeds = new CreateProductCategoriesSeeds();

        // Criar instância da classe CreateProductSituationsSeeds
        const productSituationsSeeds = new CreateProductSituationsSeeds();

        // Executa as seeds de situações
        await situationsSeeds.run(AppDataSource);

        // Executa as seeds de categorias
        await productCategoriesSeeds.run(AppDataSource);

        // Executa as seeds de situações de produtos
        await productSituationsSeeds.run(AppDataSource);

    }

    catch (error) {
        console.error("Erro ao executar as seeds:", error);

    } finally {
        await AppDataSource.destroy();
        console.log("Conexão com o banco de dados encerrada.");
    }
};

runSeeds();