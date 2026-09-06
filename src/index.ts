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

// Inclurir os Controllers
import AuthController from './controllers/AuthController.js';
import SituationsController from './controllers/SituationsController.js';


// Criar Rotas
app.use('/', AuthController);
app.use('/', SituationsController);


// Iniciar o Servidor na porta 8080
const port = 8080;

app.listen(process.env.PORT, () => {
	console.log(`Servidor rodando na porta ${process.env.PORT} http://localhost:${process.env.PORT}`);
});
