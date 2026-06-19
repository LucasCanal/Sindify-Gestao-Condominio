const User = require('../models/User')
const { success, notFound, badRequest } = require('../utils/apiResponse')
const { getPagination, paginatedResponse } = require('../utils/pagination')

// Listar todos os usuários (síndico)
const getUsers = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query)
    const filter = {}

    if (req.query.role)       filter.role = req.query.role
    if (req.query.active)     filter.active = req.query.active === 'true'
    if (req.query.apartment)  filter.apartment = req.query.apartment

    const [users, total] = await Promise.all([
      User.find(filter)
        .populate('apartment', 'number block')
        .skip(skip)
        .limit(limit)
        .sort({ name: 1 }),
      User.countDocuments(filter),
    ])

    return success(res, paginatedResponse(users, total, page, limit))
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Buscar usuário por ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('apartment', 'number block floor')

    if (!user) return notFound(res, 'Usuário não encontrado')
    return success(res, { user })
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Atualizar perfil (próprio usuário)
const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        phone,
        avatar: req.file?.path || undefined,
      },
      { new: true, runValidators: true }
    ).populate('apartment', 'number block')

    return success(res, { user }, 'Perfil atualizado com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Alterar senha
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return badRequest(res, 'Senha atual e nova senha são obrigatórias')
    }

    const user = await User.findById(req.user._id).select('+password')
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) return badRequest(res, 'Senha atual incorreta')

    user.password = newPassword
    await user.save()

    return success(res, {}, 'Senha alterada com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Atualizar role do usuário (síndico)
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body
    const roles = ['sindico', 'morador', 'porteiro', 'zelador', 'conselheiro']

    if (!roles.includes(role)) {
      return badRequest(res, 'Role inválida')
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    )

    if (!user) return notFound(res, 'Usuário não encontrado')
    return success(res, { user }, 'Role atualizada com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Ativar/desativar usuário (síndico)
const toggleUserActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return notFound(res, 'Usuário não encontrado')

    user.active = !user.active
    await user.save()

    const msg = user.active ? 'Usuário ativado' : 'Usuário desativado'
    return success(res, { user }, msg)
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

module.exports = {
  getUsers,
  getUserById,
  updateProfile,
  changePassword,
  updateUserRole,
  toggleUserActive,
}