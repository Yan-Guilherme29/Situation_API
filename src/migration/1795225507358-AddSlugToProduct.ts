import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddSlugToProduct1795225507358 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("product", new TableColumn({
            name: "slug",
            type: "varchar",
            isUnique: true,
            isNullable: false
        }));

        // Ajustar a ordem da coluna
        await queryRunner.query(`ALTER TABLE "product" MODIFY COLUMN "slug" VARCHAR(255) AFTER "name"`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("product", "slug");
    }

}
