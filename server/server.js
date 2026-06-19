// Garante o polyfill do crypto global para o Node v17
if (!globalThis.crypto) {
    globalThis.crypto = require('crypto').webcrypto;
  }

require('dotenv').config()
const http = require('http')
const app = require('./src/app')
const connectDB = require('./src/config/db')
const { initSocket } = require('./src/config/socket')

const PORT = process.env.PORT || 5000

const start = async () => {
  await connectDB()

  const httpServer = http.createServer(app)

  initSocket(httpServer)

  httpServer.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} [${process.env.NODE_ENV}]`)
  })
}

start()