const User = require('../models/User')
const Apartment = require('../models/Apartment')
const { signToken } = require('../utils/jwt')
const { success, created, badRequest, unauthorized } = require('../utils/apiResponse')
const QRCode = require('qrcode')
const crypto = require('crypto')

// Registro de novo usuário
const register = async (req, res) => {
  try {
    const { name, email, password, phone, role, apartmentId } = req.body

    const exists = await User.findOne({ email })
    if (exists) {
      return badRequest(res, 'Email já cadastrado')
    }

    const qrToken = crypto.randomBytes(32).toString('hex')

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'morador',
      apartment: apartmentId || null,
      qrToken,
    })

    const qrCodeUrl = await QRCode.toDataURL(qrToken)
    user.qrCode = qrCodeUrl
    await user.save()

    if (apartmentId) {
      await Apartment.findByIdAndUpdate(apartmentId, {
        $addToSet: { residents: user._id },
      })
    }

    const token = signToken({ id: user._id, role: user.role })

    return created(res, {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        apartment: user.apartment,
        qrCode: user.qrCode,
      },
    }, 'Usuário criado com sucesso')

  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return badRequest(res, 'Email e senha são obrigatórios')
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user || !user.active) {
      return unauthorized(res, 'Credenciais inválidas')
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return unauthorized(res, 'Credenciais inválidas')
    }

    const token = signToken({ id: user._id, role: user.role })

    return success(res, {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        apartment: user.apartment,
        avatar: user.avatar,
        qrCode: user.qrCode,
      },
    }, 'Login realizado com sucesso')

  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Retorna o usuário logado
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('apartment')
    return success(res, { user })
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

module.exports = { register, login, getMe }