require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./src/models/User')

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('conectou')
    const u = new User({ name: 'Teste', email: 'teste-debug@teste.com', password: 'senha123456', role: 'sindico' })
    await u.save()
    console.log('salvou:', u.email)
    process.exit(0)
  })
  .catch((e) => {
    console.error('erro:', e.message)
    process.exit(1)
  })
