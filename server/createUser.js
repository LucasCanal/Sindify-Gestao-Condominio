require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./src/models/User')

async function createUser() {
  const [, , name, email, password, role] = process.argv

  if (!name || !email || !password) {
    console.error('Uso: node createUser.js "Seu Nome" seuemail@exemplo.com novaSenha123 sindico')
    process.exit(1)
  }

  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Conectado ao MongoDB.')

    const existing = await User.findOne({ email: email.toLowerCase().trim() })
    if (existing) {
      console.error(`Já existe um usuário com esse e-mail: ${email}`)
      process.exit(1)
    }

    const user = new User({
      name,
      email,
      password,
      role: role || 'sindico',
    })

    await user.save()

    console.log(`Usuário criado com sucesso:`)
    console.log(`  e-mail: ${user.email}`)
    console.log(`  senha:  ${password}`)
    console.log(`  role:   ${user.role}`)
  } catch (err) {
    console.error('Erro ao criar usuário:', err.message)
  } finally {
    await mongoose.disconnect()
    process.exit(0)
  }
}

createUser()
