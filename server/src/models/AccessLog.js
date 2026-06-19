const mongoose = require('mongoose')

const accessLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    apartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Apartment',
    },
    type: {
      type: String,
      enum: ['morador', 'visitante', 'entregador', 'prestador'],
      required: true,
    },
    direction: {
      type: String,
      enum: ['entrada', 'saida'],
      required: true,
    },
    method: {
      type: String,
      enum: ['qrcode', 'manual', 'facial'],
      default: 'manual',
    },
    // Para visitantes (não cadastrados)
    visitorName: { type: String },
    visitorDoc:  { type: String }, // CPF ou RG
    visitorPhoto: { type: String }, // URL Cloudinary
    authorizedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // porteiro que autorizou
    },
    notes: { type: String },
  },
  { timestamps: true }
)

// Índice para busca rápida por apartamento e data
accessLogSchema.index({ apartment: 1, createdAt: -1 })
accessLogSchema.index({ createdAt: -1 })

module.exports = mongoose.model('AccessLog', accessLogSchema)