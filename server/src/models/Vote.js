const mongoose = require('mongoose')

const voteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: { type: String },
    options: [
      {
        label: { type: String, required: true },
        votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      },
    ],
    anonymous: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['aberta', 'encerrada'],
      default: 'aberta',
    },
    expiresAt: { type: Date },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Vote', voteSchema)