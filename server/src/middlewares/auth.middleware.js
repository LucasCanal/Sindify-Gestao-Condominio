const { verifyToken } = require('../utils/jwt')
const { unauthorized } = require('../utils/apiResponse')
const User = require('../models/User')

const auth = async (req, res, next) => {
  try {
    // Pega o token do header Authorization: Bearer <token>
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return unauthorized(res, 'Token não fornecido')
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)

    // Busca o usuário no banco (garante que ainda existe e está ativo)
    const user = await User.findById(decoded.id).select('-password')
    if (!user || !user.active) {
      return unauthorized(res, 'Usuário não encontrado ou inativo')
    }

    req.user = user
    next()
  } catch (error) {
    return unauthorized(res, 'Token inválido ou expirado')
  }
}

module.exports = auth