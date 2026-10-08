import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateProductsTable1791430599822 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "products",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "name",
                    type: "varchar",
                },
                {
                    name: "productSituationId",
                    type: "int",
                },
                {
                    name: "productCategoryId",
                    type: "int",
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                },
                {
                    name: "updatedAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP"
                }
            ]
        }));

        // Criar chave Estrangeira para a coluna productSituationId
        await queryRunner.createForeignKey("products", new TableForeignKey({
            columnNames: ["productSituationId"],
            referencedColumnNames: ["id"],
            referencedTableName: "product_situations",
            onDelete: "RESTRICT"
        }));

        // Criar chave Estrangeira para a coluna productCategoryId
        await queryRunner.createForeignKey("products", new TableForeignKey({
            columnNames: ["productCategoryId"],
            referencedColumnNames: ["id"],
            referencedTableName: "product_categories",
            onDelete: "RESTRICT"
        }));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remover chaves estrangeiras
        const table = await queryRunner.getTable("products");
        const foreignKey1 = table!.foreignKeys.find(fk => fk.columnNames.indexOf("productSituationId") !== -1);
        if (foreignKey1) {
            await queryRunner.dropForeignKey("products", foreignKey1);
        }

        const foreignKey2 = table!.foreignKeys.find(fk => fk.columnNames.indexOf("productCategoryId") !== -1);
        if (foreignKey2) {
            await queryRunner.dropForeignKey("products", foreignKey2);
        }

        // Remover a tabela products
        await queryRunner.dropTable("products");

    }

}
