//Criar migrates dentro do node, comando:
//npx prisma migrate dev --name init

//Módulo de rota do Node
const express = require("express")
const { PrismaClient } = require("@prisma/client")
const authMiddleware = require("../middlewares/auth")
const { isValidEmail } = require("../util/email")
const prisma = new PrismaClient()

const router = express.Router()

router.use(authMiddleware)

//Método get no node, UTILIZADO PARA PESQUISA
//Alterando a rota :id
router.get('/:id', async function (req, res) {
    //req.query armazena o nome da constante
    /*const nome = req.query.nome
    const orgao = req.query.orgao*/
    const id = req.params.id
    const user = await prisma.user.findUnique({ where: { id }, include: { address: true } })

    res.send(user)
});

router.get('/', async function (req, res) {
    //req.query armazena o nome da constante
    /*const nome = req.query.nome
    const orgao = req.query.orgao*/
    const user = await prisma.user.findMany()

    console.log("Resultado: ", user)

    res.send(user)
});

//Método post no node
router.post('/', async function (req, res) {
    //const data = req.body
    //desestruturação
    const { nome, email } = req.body

    if (!email) {
        return res.status(400).json({ erro: "e-mail obrigatório", data: null })
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ erro: "e-mail inválido", data: null })
    }
    const emailExist = await prisma.user.findFirst({
        where: { email },
        select: { id: true },
    });
    if (emailExist) {
        return res.status(400).json({ erro: "Já existe um cadastro com este e-mail", data: null });
    }

    const user = await prisma.user.create({ data: { name: nome, email: email } })
    //res.send(data)
    //res.send(email)
    res.send(user)
});

//Método put no node
router.put('/', async function (req, res) {
    const { nome, id } = req.body

    if (!id) {
        return res.status(400).json({ erro: "Parâmetro id obrigatório", data: null })
    }
    if (!nome) {
        return res.status(400).json({ erro: "nome obrigatório", data: null })
    }
    const idExist = await prisma.user.findUnique({
        where: { id },
        select: { id: true },
    });

    if (!idExist) {
        return res.status(400).json({ erro: "Usuário não encontrado", data: null })
    }

    const user = await prisma.user.update({ where: { id }, data: { name: nome } })
    res.send({ data: user })
});

//Método delete no node
router.delete('/', async function (req, res) {
    const id = req.body.id

    if (!id) {
        return res.status(400).json({ erro: "Parâmetro id obrigatório", data: null })
    }
    const idExist = await prisma.user.findUnique({
        where: { id },
        select: { id: true },
    });
    if (!idExist) {
        return res.status(400).json({ erro: "Usuário não encontrado", data: null })
    }
    await prisma.user.delete({ where: { id } })
    res.send({ deleted: true })
});

module.exports = (app) => app.use("/api/v1/user", router)