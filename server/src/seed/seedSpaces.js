/**
 * Script de seed: cria as áreas comuns padrão do condomínio
 * (sem duplicar as que já existem).
 *
 * Como rodar (na raiz do backend, onde está o .env com MONGO_URI):
 *   node seed/seedSpaces.js
 */

require('dotenv').config()

// Polyfill: em versões antigas do Node (ex: v17), o objeto `crypto`
// não está disponível globalmente, mas o driver do MongoDB espera que esteja.
// Isso expõe o módulo nativo 'crypto' do Node como variável global.
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = require('crypto')
}

const mongoose = require('mongoose')
const Space = require('../models/Space')

const SPACES = [
  {
    name: 'Sala de Jogos',
    capacity: 10,
    openTime: '08:00',
    closeTime: '22:00',
  },
  {
    name: 'Salão de Festas',
    capacity: 80,
    openTime: '08:00',
    closeTime: '23:00',
  },
  {
    name: 'Área Gourmet',
    capacity: 30,
    openTime: '08:00',
    closeTime: '22:00',
  },
  {
    name: 'Sauna',
    capacity: 8,
    openTime: '08:00',
    closeTime: '21:00',
  },
  {
    name: 'Churrasqueira',
    capacity: 40,
    openTime: '08:00',
    closeTime: '23:00',
  },
  {
    name: 'Cinema',
    capacity: 20,
    openTime: '10:00',
    closeTime: '23:00',
  },
]

async function run() {
  const uri = process.env.MONGO_URI || process.env.DATABASE_URL
  if (!uri) {
    console.error('Defina MONGO_URI (ou DATABASE_URL) no seu .env antes de rodar o seed.')
    process.exit(1)
  }

  await mongoose.connect(uri)
  console.log('Conectado ao banco.')

  for (const spaceData of SPACES) {
    const exists = await Space.findOne({ name: spaceData.name })
    if (exists) {
      console.log(`- "${spaceData.name}" já existe, pulando.`)
      continue
    }
    await Space.create(spaceData)
    console.log(`+ "${spaceData.name}" criada.`)
  }

  console.log('Seed finalizado.')
  await mongoose.disconnect()
  process.exit(0)
}

run().catch((err) => {
  console.error('Erro ao rodar o seed:', err)
  process.exit(1)
})