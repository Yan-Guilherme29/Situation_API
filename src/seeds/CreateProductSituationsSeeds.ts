import { DataSource } from "typeorm";
import { ProductSituation } from "../entity/ProductSituations";

export default class CreateProductSituationsSeeds {

    public async run(dataSource: DataSource): Promise<void> {
        console.log("Iniciando seeds de situações de produtos...");
        
        const productSituationsRepository = dataSource.getRepository(ProductSituation);

        const existingCount = await productSituationsRepository.count();

        if (existingCount > 0) {
            console.log("As situações de produtos já foram inseridas anteriormente. Pulando seeds.");
            return;
        }

        const productSituationsData = [
            { name: "Disponível" },
            { name: "Indisponível" },
            { name: "Em Estoque" },
            { name: "Fora de Estoque" },
        ];

        await productSituationsRepository.save(productSituationsData);

        console.log("Seeds de situações de produtos concluídas com sucesso!");
    }
}