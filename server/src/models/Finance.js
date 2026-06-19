const mongoose = require('mongoose')

const financeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['receita', 'despesa'],
      required: true,
    },
    category: {
      type: String,
      enum: ['condominio', 'manutencao', 'limpeza', 'seguranca', 'energia', 'agua', 'outros'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    attachment: { type: String }, // nota fiscal, comprovante
    apartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Apartment', // preenchido quando é taxa de condomínio específica
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    notes: { type: String },
  },
  { timestamps: true }
)

financeSchema.index({ date: -1, type: 1 })

module.exports = mongoose.model('Finance', financeSchema)