# 🚀 Node API — Desenvolvimento para Web II

API REST desenvolvida para a disciplina de **Desenvolvimento para Web II**, utilizando **Node.js, TypeScript e Express**, com persistência de dados em **MySQL** através do **TypeORM**.

---

## 🛠️ Tecnologias

### Backend

* **Node.js 22+**
* **TypeScript**
* **Express**

### Banco de Dados

* **MySQL 8+**
* **TypeORM**
* **mysql2**

### Ferramentas e Utilitários

* **dotenv** — gerenciamento de variáveis de ambiente
* **reflect-metadata** — suporte ao TypeORM
* **ts-node** — execução de TypeScript
* **concurrently** — execução de comandos simultâneos

---

## 📋 Requisitos

Antes de executar o projeto, certifique-se de possuir:

* [Node.js](https://nodejs.org/) **22 ou superior**
* [MySQL](https://www.mysql.com/) **8 ou superior**
* **npm**

---

## 🚀 Como executar o projeto

### 1. Clone o repositório

```bash
git clone URL_DO_REPOSITORIO
cd NOME_DO_PROJETO
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Duplique o arquivo:

```text
.env.example
```

e renomeie a cópia para:

```text
.env
```

Em seguida, configure as credenciais do banco de dados de acordo com o seu ambiente local.

Exemplo:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=sua_senha
DB_DATABASE=nodeapi
```

> ⚠️ Nunca envie o arquivo `.env` para o GitHub. Ele deve estar listado no `.gitignore`.

---

## 🗄️ Configuração do Banco de Dados

### Criando o banco

No MySQL, execute:

```sql
CREATE DATABASE nodeapi
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

### Executando as Migrations

Após compilar o projeto, execute:

```bash
npx typeorm migration:run -d dist/data-source.js
```

As migrations serão responsáveis por criar e estruturar as tabelas necessárias no banco de dados.

### Executando os Seeds

Para inserir registros de teste:

```bash
node dist/run-seeds.js
```

---

## ▶️ Executando a aplicação

Para iniciar o projeto em modo de desenvolvimento, com monitoramento das alterações:

```bash
npm run start:watch
```

A API estará disponível localmente na porta configurada pelo projeto.

Exemplo:

```text
http://localhost:3000
```

---

## 🎓 Projeto Acadêmico

Projeto desenvolvido como parte da disciplina de **Desenvolvimento para Web II**.

**Tecnologias principais:**

`Node.js` • `TypeScript` • `Express` • `MySQL` • `TypeORM`

---

## 🔗 Autor

Yan Guilherme Siqueira Gomides

<a href="https://www.linkedin.com/in/yan-guilherme-dev-backend/" target="_blank">
  <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white" alt="LinkedIn">
</a>
