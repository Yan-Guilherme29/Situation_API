import { DataSource } from "typeorm";
import { Situation } from "../entity/Situations";

    export default class CreateSituationsSeeds {

        public async run(dataSource: DataSource): Promise<void> {
            console.log("Iniciando seeds de situações...");

            const situationsRepository = dataSource.getRepository(Situation);

            const existingCount = await situationsRepository.count();

            if (existingCount > 0) {
                console.log("As situações já foram inseridas anteriormente. Pulando seeds.");
                return;
            }

            const situationsData = [
                { nameSituation: "Ativo" },
                { nameSituation: "Inativo" },
                { nameSituation: "Pendente" },
            ];

            await situationsRepository.save(situationsData);

            console.log("Seeds de situações concluídas com sucesso!");

        }
    }