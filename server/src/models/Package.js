const mongoose = require('mongoose')

const packageSchema = new mongoose.Schema(
  {
    apartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Apartment',
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    recipientName: {
      type: String,
      required: true, // nome na etiqueta
    },
    sender: { type: String }, // ex: "Amazon", "Shopee"
    trackingCode: { type: String },
    photo: { type: String }, // foto tirada pelo porteiro
    status: {
      type: String,
      enum: ['aguardando', 'retirado', 'devolvido'],
      default: 'aguardando',
    },
    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // porteiro que recebeu
    },
    withdrawnBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // morador que retirou
    },
    withdrawnAt: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
)

packageSchema.index({ apartment: 1, status: 1 })

module.exports = mongoose.model('Package', packageSchema)