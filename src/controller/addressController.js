//Criar migrates dentro do node, comando:
//npx prisma migrate dev --name init

//Módulo de rota do Node
const express = require("express")
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const router = express.Router()


//Método get no node, UTILIZADO PARA PESQUISA
//Alterando a rota :id
router.get('/:id', async function (req, res) {
    //req.query armazena o nome da constante
    /*const nome = req.query.nome
    const orgao = req.query.orgao*/
    const id = req.params.id
    const address = await prisma.address.findUnique({
        where: { id },
        include: { user: true }
    })

    res.send(address)
});

router.get('/', async function (req, res) {
    //req.query armazena o nome da constante
    /*const nome = req.query.nome
    const orgao = req.query.orgao*/
    const address = await prisma.address.findMany()

    res.send(address)
});

//Método post no node
router.post('/', async function (req, res) {
    const { cep, logradouro, nr, cidade, estado, complemento, userId, actived } = req.body

    if (!userId) {
        return res.status(400).json({ erro: "userId obrigatório", data: null })
    }

    if (!cep) {
        return res.status(400).json({ erro: "CEP obrigatório", data: null })
    }

    if (!logradouro) {
        return res.status(400).json({ erro: "Logradouro obrigatório", data: null })
    }

    if (!nr) {
        return res.status(400).json({ erro: "Número obrigatório", data: null })
    }

    if (!cidade) {
        return res.status(400).json({ erro: "Cidade obrigatória", data: null })
    }

    if (!estado) {
        return res.status(400).json({ erro: "Estado obrigatório", data: null })
    }

    if (!actived) {
        return res.status(400).json({ erro: "Actived obrigatório", data: null })
    }

    //findunique é utilizado para localizar id
    const userIdExist = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
    });
    if (!userIdExist) {
        return res.status(400).json({ erro: "Usuário não encontrado", data: null });
    }

    //verificar cep
    const verificaCep = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`)
    const resultadoCep = await verificaCep.json()

    if (resultadoCep.errors) {
        return res.status(400).json({ erro: "CEP com formato inválido ou endereço não encontrado", data: null });
    }

    const address = await prisma.address.create({ data: { cep, logradouro, nr, cidade, estado, complemento, userId, actived } })
    //res.send(data)
    //res.send(email)
    res.send(address)
});

//Método put no node
router.put('/', async function (req, res) {
    const { id, cep, logradouro, nr, cidade, estado, complemento, actived } = req.body

    if (!id) {
        return res.status(400).json({ erro: "Id obrigatório", data: null })
    }

    if (!cep) {
        return res.status(400).json({ erro: "CEP obrigatório", data: null })
    }

    if (!logradouro) {
        return res.status(400).json({ erro: "Logradouro obrigatório", data: null })
    }

    if (!nr) {
        return res.status(400).json({ erro: "Número obrigatório", data: null })
    }

    if (!cidade) {
        return res.status(400).json({ erro: "Cidade obrigatória", data: null })
    }

    if (!estado) {
        return res.status(400).json({ erro: "Estado obrigatório", data: null })
    }

    if (!actived) {
        return res.status(400).json({ erro: "Actived obrigatório", data: null })
    }

    //findunique é utilizado para localizar id
    const IdExist = await prisma.address.findUnique({
        where: { id },
        select: { id: true },
    });
    if (!IdExist) {
        return res.status(400).json({ erro: "Endereço não encontrado", data: null });
    }

    const address = await prisma.address.update({ where: { id }, data: { cep, logradouro, nr, cidade, estado, complemento, actived } })
    res.send({ data: address })
});

//Método delete no node
router.delete('/', async function (req, res) {
    const id = req.body.id

    if (!id) {
        return res.status(400).json({ erro: "Parâmetro id obrigatório", data: null })
    }
    const idExist = await prisma.address.findUnique({
        where: { id },
        select: { id: true },
    });
    if (!idExist) {
        return res.status(400).json({ erro: "Usuário não encontrado", data: null })
    }
    await prisma.address.delete({ where: { id } })
    res.send({ deleted: true })
});

module.exports = (app) => app.use("/api/v1/address", router)