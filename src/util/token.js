const jwt = require("jsonwebtoken")

exports.generateToken = (params = {}) => {
    return jwt.sign(params, process.env.KEY_TOKEN, { expiresIn: 86400 })
}

exports.verifyToken = (token) => {
    const result = jwt.verify(token, process.env.KEY_TOKEN, (error, decoded) => {
        if (error) return false
        return decoded
    })
    return result
}