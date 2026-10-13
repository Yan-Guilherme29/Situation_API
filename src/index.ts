// Biblioteca Express
import express from 'express';

// Importar variáveis de ambiente
import dotenv from 'dotenv';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Criar Aplicação Express
const app = express();

// Criar um middleware para analisar o corpo das requisições como JSON
app.use(express.json());

// Formatar a saída JSON com 2 espaços de indentação
app.set('json spaces', 2);

// Inclurir os Controllers
import AuthController from './controllers/AuthController.js';
import SituationsController from './controllers/SituationsController.js';
import ProductCategoriesController from './controllers/ProductCategoriesController.js';
import ProductSituationsController from './controllers/ProductSituationsController.js';
import ProductsController from './controllers/ProductsController.js';
import UsersController from './controllers/UsersController.js';


// Criar Rotas
app.use('/', AuthController);
app.use('/', SituationsController);
app.use('/', ProductCategoriesController);
app.use('/', ProductSituationsController);
app.use('/', ProductsController);
app.use('/', UsersController);

app.listen(process.env.PORT, () => {
	console.log(`Servidor rodando na porta ${process.env.PORT} http://localhost:${process.env.PORT}`);
});
