import { DataSource } from "typeorm";
import { ProductCategory } from "../entity/ProductCategories";

export default class CreateProductCategoriesSeeds {

    public async run(dataSource: DataSource): Promise<void> {
        console.log("Iniciando seeds de categorias de produtos...");
        
        const productCategoriesRepository = dataSource.getRepository(ProductCategory);

        const existingCount = await productCategoriesRepository.count();

        if (existingCount > 0) {
            console.log("As categorias de produtos já foram inseridas anteriormente. Pulando seeds.");
            return;
        }

        const productCategoriesData = [
            { name: "Eletrônicos" },
            { name: "Roupas" },
            { name: "Calçados" },
            { name: "Livros" },
        ];

        await productCategoriesRepository.save(productCategoriesData);

        console.log("Seeds de categorias de produtos concluídas com sucesso!");
    }
}