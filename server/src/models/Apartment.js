const mongoose = require('mongoose')

const apartmentSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: [true, 'Número do apartamento é obrigatório'],
      trim: true,
    },

    block: {
      type: String,
      trim: true,
    },

    floor: {
      type: Number,
    },

    area: {
      type: Number,
    },

    type: {
      type: String,
      default: 'Residencial',
    },

    residents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    visitors: [
      {
        name: {
          type: String,
          required: true,
        },
        authorizationDate: {
          type: Date,
        },
      },
    ],

    pets: [
      {
        name: {
          type: String,
          required: true,
        },
        kind: {
          type: String,
          required: true,
        },
      },
    ],

    residentsInfo: [
      {
        name: {
          type: String,
          required: true,
        },
        role: {
          type: String,
        },
      },
    ],

    vehicles: [
      {
        model: {
          type: String,
          required: true,
        },
        plate: {
          type: String,
          required: true,
          uppercase: true,
        },
      },
    ],

    emergencyContacts: [
      {
        name: {
          type: String,
          required: true,
        },
        phone: {
          type: String,
          required: true,
        },
        kinship: {
          type: String,
        },
      },
    ],

    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Apartment', apartmentSchema)