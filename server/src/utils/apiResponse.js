const success = (res, data = {}, message = 'Sucesso', statusCode = 200) => {
    return res.status(statusCode).json({ ok: true, message, data })
  }
  
  const created = (res, data = {}, message = 'Criado com sucesso') => {
    return success(res, data, message, 201)
  }
  
  const error = (res, message = 'Erro interno', statusCode = 500, errors = null) => {
    const payload = { ok: false, message }
    if (errors) payload.errors = errors
    return res.status(statusCode).json(payload)
  }
  
  const notFound = (res, message = 'Não encontrado') => {
    return error(res, message, 404)
  }
  
  const unauthorized = (res, message = 'Não autorizado') => {
    return error(res, message, 401)
  }
  
  const forbidden = (res, message = 'Acesso negado') => {
    return error(res, message, 403)
  }
  
  const badRequest = (res, message = 'Dados inválidos', errors = null) => {
    return error(res, message, 400, errors)
  }
  
  module.exports = { success, created, error, notFound, unauthorized, forbidden, badRequest }