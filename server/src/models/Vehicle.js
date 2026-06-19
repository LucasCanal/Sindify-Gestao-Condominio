const mongoose = require('mongoose')

const vehicleSchema = new mongoose.Schema(
  {
    apartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Apartment',
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    plate: {
      type: String,
      required: [true, 'Placa é obrigatória'],
      uppercase: true,
      trim: true,
    },

    brand: {
      type: String,
      trim: true, // Toyota
    },

    model: {
      type: String,
      trim: true, // Corolla
    },

    color: {
      type: String,
      trim: true,
    },

    photo: {
      type: String, // URL Cloudinary
    },

    parkingSpot: {
      type: String,
      trim: true, // Vaga 42
    },

    authorizedDrivers: [
      {
        name: {
          type: String,
          required: [true, 'Nome é obrigatório'],
          trim: true,
        },

        phone: {
          type: String,
          trim: true,
          default: '',
        },

        document: {
          type: String,
          trim: true,
          default: '',
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Vehicle', vehicleSchema)