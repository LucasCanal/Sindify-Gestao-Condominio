const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema(
  {
    space: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Space',
      required: true,
    },
    resident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    apartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Apartment',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true, // ex: "14:00"
    },
    endTime: {
      type: String,
      required: true, // ex: "18:00"
    },
    guests: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pendente', 'confirmada', 'cancelada', 'concluida'],
      default: 'confirmada',
    },
    notes: { type: String },
  },
  { timestamps: true }
)

// Índice para checar conflito de horário
bookingSchema.index({ space: 1, date: 1, status: 1 })

module.exports = mongoose.model('Booking', bookingSchema)