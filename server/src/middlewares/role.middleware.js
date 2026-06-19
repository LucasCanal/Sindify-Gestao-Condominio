const { forbidden } = require('../utils/apiResponse')

// Uso: role(['sindico', 'porteiro'])
const role = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return forbidden(res, 'Acesso negado')
    }

    if (!roles.includes(req.user.role)) {
      return forbidden(res, `Acesso restrito para: ${roles.join(', ')}`)
    }

    next()
  }
}

module.exports = role