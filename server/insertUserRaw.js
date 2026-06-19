require('dotenv').config()
const mongoose = require('mongoose')

async function insertUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Conectado ao MongoDB.')

    const db = mongoose.connection.db
    const result = await db.collection('users').insertOne({
      name: 'Lucas Canal',
      email: 'lucas@teste.com',
      password: '$2b$12$kofszDY7wUsuSHo4YG3wt.M.NOpu3bU.J/c663UjQ8Pu1HlO1Lnx.',
      role: 'sindico',
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log('Usuário inserido com sucesso. ID:', result.insertedId)
    console.log('Login: lucas@teste.com')
    console.log('Senha: senha123456')
  } catch (err) {
    console.error('Erro ao inserir usuário:', err.message)
  } finally {
    await mongoose.disconnect()
    process.exit(0)
  }
}

insertUser()
