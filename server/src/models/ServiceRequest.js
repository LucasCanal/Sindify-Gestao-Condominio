const mongoose = require('mongoose')

const serviceRequestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['eletrica', 'hidraulica', 'estrutural', 'limpeza', 'seguranca', 'outros'],
      required: true,
    },
    priority: {
      type: String,
      enum: ['baixa', 'media', 'alta', 'urgente'],
      default: 'media',
    },
    status: {
      type: String,
      enum: ['aberto', 'em_andamento', 'concluido', 'cancelado'],
      default: 'aberto',
    },
    photos: [{ type: String }], // até 3 fotos
    apartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Apartment',
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // zelador ou prestador
    },
    resolvedAt: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
)

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema)