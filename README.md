# AS66A-BackEnd-Certificadora-Especifica
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
# 💰 Backend para Calculadora de Investimentos

Este é o repositório do **backend** para uma aplicação de **calculadora de investimentos**.  
A API foi desenvolvida em **Node.js**, **Express.js** e **MongoDB**, com foco em **segurança**, **autenticação completa** e **registro detalhado de logs**.

---

## ✨ Funcionalidades Principais

- **🔐 Autenticação de Utilizadores:** Sistema completo de registo e login com geração de tokens JWT para sessões seguras.  
- **🧩 Segurança de Senhas:** As senhas são criptografadas utilizando o algoritmo `bcrypt` antes de serem armazenadas.  
- **📧 Recuperação de Senha:** Fluxo seguro com envio de e-mail via **SendGrid**, utilizando tokens únicos com expiração.  
- **📊 Calculadora de Investimentos:** Endpoint que calcula a rentabilidade de investimentos (`CDB`, `LCI`, `Tesouro`, etc.).  
- **🪵 Sistema de Log Robusto:** Utilização do **Winston** para gerar logs separados por nível:
  - `combined.log` → Registo de todas as atividades.
  - `error.log` → Registo exclusivo de erros.
  - `security.log` → Eventos de segurança (login falhado, tentativas de recuperação, etc.) com **IP** do requisitante.

---

## 🛠️ Tecnologias Utilizadas

- **Backend:** Node.js, Express.js  
- **Banco de Dados:** MongoDB (NoSQL) com Mongoose (ODM)  
- **Autenticação:** JSON Web Tokens (JWT)  
- **Criptografia:** Bcrypt.js  
- **Envio de E-mails:** SendGrid  
- **Logging:** Winston  
- **Validação:** Validador de CPF customizado  
- **Configuração:** Dotenv  

---

## 🚀 Como Executar o Projeto Localmente

### 📋 Pré-requisitos

- Node.js (versão 18 ou superior)  
- MongoDB (local ou MongoDB Atlas)  
- Conta no SendGrid (para envio de e-mails)

### ⚙️ Passo a Passo

#### 1. Clonar o Repositório
```bash
git clone https://github.com/AndreSouza94/AS66A-BackEnd-Certificadora-Especifica.git
cd AS66A-BackEnd-Certificadora-Especifica
```

#### 2. Instalar as Dependências
```bash
npm install
```

#### 3. Configurar as Variáveis de Ambiente
Crie um ficheiro `.env` na raiz do projeto (ou copie o `.env.example`) e preencha com suas credenciais:

```env
PORT=3000
MONGO_URI=[Sua string de conexão do MongoDB]
JWT_SECRET=[Uma chave secreta forte para o JWT]
JWT_EXPIRES_IN=90d

# Credenciais do SendGrid
SENDGRID_API_KEY=[Sua chave de API do SendGrid]
SENDGRID_VERIFIED_SENDER=[Seu e-mail verificado no SendGrid]
```

#### 4. Iniciar o Servidor

Modo desenvolvimento (com reinício automático):
```bash
npm run dev
```

Modo produção:
```bash
npm start
```

O servidor estará rodando em:  
👉 **http://localhost:3000**

---

## 📖 Documentação da API

### 🔑 Autenticação

#### **POST /api/auth/register**  
Regista um novo utilizador.  
**Body:**
```json
{
  "name": "Nome Completo do Utilizador",
  "email": "utilizador@exemplo.com",
  "cpf": "12345678900",
  "password": "senhaForte123"
}
```

#### **POST /api/auth/login**  
Autentica um utilizador e retorna um token JWT.  
**Body:**
```json
{
  "email": "utilizador@exemplo.com",
  "password": "senhaForte123"
}
```

---

### 🔄 Recuperação de Senha

#### **POST /api/auth/forgot-password**  
Inicia o processo de recuperação de senha, enviando um link por e-mail.  
**Body:**
```json
{
  "email": "utilizador@exemplo.com"
}
```

#### **PATCH /api/auth/reset-password/:token**  
Define uma nova senha utilizando o token recebido por e-mail.  
**Body:**
```json
{
  "password": "minhaNovaSenhaSuperSegura"
}
```

---

### 💹 Calculadora de Investimentos

#### **POST /api/auth/calc**  
Calcula a rentabilidade de um investimento.  
**Body:**
```json
{
  "type": "cdb",
  "initialValue": 1000,
  "time": 2,
  "annualInterest": 10
}
```

---

## 🗃️ Arquitetura de Dados

A aplicação utiliza **MongoDB**, com duas coleções principais:  
`users` e `calculations`.

### 1. Visão Geral  
- Um **usuário** pode ter **múltiplos cálculos**.  
- Relacionamento **um-para-muitos** (`users` → `calculations`).

---

### 2. Esquemas das Coleções

#### 🧍‍♂️ Coleção: `users`
```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String",
  "cpf": "String",
  "password": "String (bcrypt hash)",
  "passwordResetToken": "String | null",
  "passwordResetExpires": "Date | null",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

#### 💰 Coleção: `calculations`
```json
{
  "_id": "ObjectId",
  "user": "ObjectId (ref: User)",
  "type": "String (cdb | tesouro | lci | lca | cri | cra)",
  "initialValue": "Number",
  "time": "Number (anos)",
  "annualInterest": "Number (%)",
  "result": {
    "valorBruto": "Number",
    "lucroBruto": "Number",
    "valorLiquido": "Number",
    "custoTotal": "Number",
    "impostoDeRenda": "Number"
  },
  "createdAt": "Date"
}
```

---

### 3. Exemplos de Documentos

#### Exemplo — Coleção `users`
```json
{
  "_id": "634d9b6e1a3b4c5d6e7f8g9h",
  "name": "Ana Clara",
  "email": "ana.clara@example.com",
  "cpf": "11122233344",
  "password": "$2a$12$RndmHashValueGeneratedByBcrypt123",
  "passwordResetToken": null,
  "passwordResetExpires": null,
  "createdAt": "2025-10-16T21:15:00.000Z",
  "updatedAt": "2025-10-16T21:15:00.000Z"
}
```

#### Exemplo — Coleção `calculations`
```json
{
  "_id": "7a8b9c0d1e2f3g4h5i6j7k8l",
  "user": "634d9b6e1a3b4c5d6e7f8g9h",
  "type": "lci",
  "initialValue": 10000,
  "time": 3,
  "annualInterest": 9.8,
  "result": {
    "valorBruto": 13245.48,
    "lucroBruto": 3245.48,
    "valorLiquido": 13245.48,
    "custoTotal": 0,
    "impostoDeRenda": 0
  },
  "createdAt": "2025-10-16T21:20:00.000Z"
}
```

---

## 🧠 Autor
