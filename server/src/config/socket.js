const { Server } = require('socket.io')

let io

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    console.log(`Socket conectado: ${socket.id}`)

    socket.on('join:apartment', (apartmentId) => {
      socket.join(`apartment:${apartmentId}`)
    })

    socket.on('join:lobby', () => {
      socket.join('lobby')
    })

    socket.on('join:admin', () => {
      socket.join('admin')
    })

    socket.on('disconnect', () => {
      console.log(`Socket desconectado: ${socket.id}`)
    })
  })

  return io
}

const getIO = () => {
  if (!io) throw new Error('Socket.io não foi inicializado')
  return io
}

module.exports = { initSocket, getIO }