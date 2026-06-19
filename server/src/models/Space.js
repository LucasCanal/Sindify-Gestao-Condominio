const mongoose = require('mongoose')

const spaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // ex: Salão de Festas, Sala de Jogos
    },
    description: { type: String },
    capacity: { type: Number },
    photo: { type: String },
    rules: { type: String }, // regras de uso
    availableDays: {
      type: [Number], // 0=Dom, 1=Seg... 6=Sáb
      default: [0, 1, 2, 3, 4, 5, 6],
    },
    openTime:  { type: String, default: '08:00' },
    closeTime: { type: String, default: '22:00' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Space', spaceSchema)