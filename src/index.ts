// Biblioteca Express
import express from 'express';

// Criar Aplicação Express
const app = express();

// Inclurir os Controllers
import login from './controllers/login.js';

app.use('/', login);


// Iniciar o Servidor na porta 8080
const port = 8080;

app.listen(port, () => {
	console.log(`Servidor rodando em http://localhost:${port}`);
});