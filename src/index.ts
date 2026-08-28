// Biblioteca Express
import express from 'express';

// Importar variáveis de ambiente
import dotenv from 'dotenv';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Criar Aplicação Express
const app = express();

// Inclurir os Controllers
import login from './controllers/login.js';

app.use('/', login);


// Iniciar o Servidor na porta 8080
const port = 8080;

app.listen(process.env.PORT, () => {
	console.log(`Servidor rodando na porta ${process.env.PORT} http://localhost:${process.env.PORT}`);
});