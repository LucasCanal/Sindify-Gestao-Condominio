const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

const app = express()

app.use(helmet())

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rotas — vamos descomentando conforme construímos cada módulo
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/users', require('./routes/users.routes'))
app.use('/api/apartments', require('./routes/apartments.routes'))
app.use('/api/vehicles', require('./routes/vehicles.routes'))
app.use('/api/access', require('./routes/access.routes'))
app.use('/api/bookings', require('./routes/bookings.routes'))
app.use('/api/packages', require('./routes/packages.routes'))
app.use('/api/notices', require('./routes/notices.routes'))
app.use('/api/finances', require('./routes/finances.routes'))
app.use('/api/service-requests', require('./routes/serviceRequests.routes'))
app.use('/api/votes', require('./routes/votes.routes'))

// Rota de saúde — serve para testar se o servidor está de pé
app.get('/api/health', (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV, timestamp: new Date() })
})

// Handler global de erros
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.statusCode || 500).json({
    ok: false,
    message: err.message || 'Erro interno do servidor',
  })
})

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({ ok: false, message: 'Rota não encontrada' })
})

module.exports = app