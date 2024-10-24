const { verifyToken } = require("../util/token")

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).send({ error: "Nenhum token fornecido" })

    const parts = authHeader.split(" ")

    if (!parts.length === 2)
        return res.status(401).send({ error: "token incorreto" })

    const [scheme, token] = parts

    if (!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: "token malformado" })

    const decoded = verifyToken(token)
    if (!decoded) return res.status(401).send({ error: "token inválido ou expirado" })

    req.userId = decoded.id

    return next();
}