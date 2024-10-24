const express = require("express")
const { PrismaClient } = require("@prisma/client")
const jwt = require("jsonwebtoken")
const { isValidEmail } = require("../util/email")
const { generateToken } = require("../util/token")

const prisma = new PrismaClient()

const router = express.Router()

router.post('/authenticate', async function (req, res) {
    const { email } = req.body
    if (!email) {
        return res.json({ error: "E-mail Obrigatório", data: null })
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ erro: "e-mail inválido", data: null })
    }

    const user = await prisma.user.findFirst({ where: { email } })
    if (!user) {
        return res.json({ error: "Usuário não encontrado", data: null })
    }

    const token = generateToken({ id: user.id })
    res.status(200).json({ data: token })
});


module.exports = (app) => app.use("/api/v1/auth", router)
