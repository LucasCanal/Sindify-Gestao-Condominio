const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Nome é obrigatório'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email é obrigatório'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Senha é obrigatória'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['sindico', 'morador', 'porteiro', 'zelador', 'conselheiro'],
      default: 'morador',
    },
    phone: { type: String, trim: true },
    avatar: { type: String },
    apartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Apartment',
    },
    qrCode:  { type: String },
    qrToken: { type: String },
    active:  { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Hash da senha antes de salvar — sem next
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 12)
})

// Método para comparar senha no login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', userSchema)