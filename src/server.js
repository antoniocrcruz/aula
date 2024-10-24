//Criar migrates dentro do node, comando:
//npx prisma migrate dev --name init

//Módulo de rota do Node
const express = require("express")
const { PrismaClient } = require("@prisma/client")
const bodyParser = require("body-parser")
require('dotenv').config()

const prisma = new PrismaClient()

//Cria a constante das rotas
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

require("./controller/index")(app);

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000")
});
