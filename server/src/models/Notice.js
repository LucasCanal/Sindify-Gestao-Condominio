const mongoose = require('mongoose')

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['informativo', 'urgente', 'manutencao', 'assembleia', 'financeiro'],
      default: 'informativo',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    readBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        readAt: { type: Date, default: Date.now },
      },
    ],
    pinned: { type: Boolean, default: false },
    expiresAt: { type: Date }, // aviso some depois dessa data
  },
  { timestamps: true }
)

module.exports = mongoose.model('Notice', noticeSchema)