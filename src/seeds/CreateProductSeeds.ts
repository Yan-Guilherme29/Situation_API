// Importar a conexão com banco de dados
import {DataSource} from "typeorm";

// Importar as entidades
import {Product} from "../entity/Products";
import {ProductCategory} from "../entity/ProductCategories";
import {ProductSituation} from "../entity/ProductSituations";

export default class CreateProductSeeds {
    public async run(dataSource: DataSource): Promise<void> {
        console.log('Iniciando a criação de seeds para produtos...');

        // Obter os repositórios das entidades
        const productRepository = dataSource.getRepository(Product);
        const productCategoryRepository = dataSource.getRepository(ProductCategory);
        const productSituationRepository = dataSource.getRepository(ProductSituation);

        // Verificar se já existem registros na tabela de produtos
        const existingProducts = await productRepository.find();
        if (existingProducts.length > 0) {
            console.log('Produtos já existem no banco de dados. Nenhuma seed será criada.');
            return;
        }

        // Buscar a situação no banco de dados
        const situation = await productSituationRepository.findOne({ where: { name: 'Ativo' } });

        // Verificar se a situação foi encontrada
        if (!situation) {
            console.error('Situação "Ativo" não encontrada no banco de dados. Certifique-se de que a seed de situações foi executada antes.');
            return;
        }

        // Buscar a categoria no banco de dados
        const category = await productCategoryRepository.findOne({ where: { name: 'Eletrônicos' } });

        // Verificar se a categoria foi encontrada
        if (!category) {
            console.error('Categoria "Eletrônicos" não encontrada no banco de dados. Certifique-se de que a seed de categorias foi executada antes.');
            return;
        }

        // Criar os produtos
        const products = [
            {
                name: 'Smartphone XYZ',
                slug: 'smartphone-xyz',
                category: category,
                situation: situation,
            },
            {
                name: 'Notebook ABC',
                slug: 'notebook-abc',
                category: category,
                situation: situation,
            },
            {
                name: 'Tablet DEF',
                slug: 'tablet-def',
                category: category,
                situation: situation,
            },
        ];

        // Salvar os produtos no banco de dados
        await productRepository.save(products);
        console.log('Seeds para produtos criadas com sucesso.');
    }
}
