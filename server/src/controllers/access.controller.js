const AccessLog = require('../models/AccessLog')
const User = require('../models/User')
const Apartment = require('../models/Apartment')
const { success, created, notFound, badRequest } = require('../utils/apiResponse')
const { getPagination, paginatedResponse } = require('../utils/pagination')
const { getIO } = require('../config/socket')

// Validar QR Code do morador (porteiro escaneia)
const validateQRCode = async (req, res) => {
  try {
    const { qrToken, direction } = req.body

    // Busca o usuário pelo token do QR Code
    const user = await User.findOne({ qrToken }).populate('apartment')
    if (!user) return badRequest(res, 'QR Code inválido')
    if (!user.active) return badRequest(res, 'Morador inativo')

    // Registra o log de acesso
    const log = await AccessLog.create({
      user: user._id,
      apartment: user.apartment?._id,
      type: 'morador',
      direction: direction || 'entrada',
      method: 'qrcode',
      authorizedBy: req.user._id,
    })

    // Notifica portaria e admin em tempo real
    try {
      const io = getIO()
      const payload = {
        message: `${user.name} — ${direction === 'saida' ? 'Saída' : 'Entrada'} registrada`,
        user: { name: user.name, apartment: user.apartment },
        direction,
        timestamp: new Date(),
      }
      io.to('lobby').emit('access:new', payload)
      io.to('admin').emit('access:new', payload)
    } catch (_) {}

    return success(res, {
      log,
      user: {
        name: user.name,
        apartment: user.apartment,
        avatar: user.avatar,
      },
    }, `${direction === 'saida' ? 'Saída' : 'Entrada'} registrada com sucesso`)

  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Registrar visitante manualmente
const registerVisitor = async (req, res) => {
  try {
    const { visitorName, visitorDoc, apartmentId, direction, notes } = req.body

    const apartment = await Apartment.findById(apartmentId)
    if (!apartment) return notFound(res, 'Apartamento não encontrado')

    const log = await AccessLog.create({
      type: 'visitante',
      direction: direction || 'entrada',
      method: 'manual',
      visitorName,
      visitorDoc,
      visitorPhoto: req.file?.path || null,
      apartment: apartmentId,
      authorizedBy: req.user._id,
      notes,
    })

    // Notifica o apartamento que está recebendo a visita
    try {
      const io = getIO()
      io.to(`apartment:${apartmentId}`).emit('visitor:new', {
        message: `Visitante ${visitorName} chegou na portaria`,
        log,
      })
      io.to('lobby').emit('access:new', {
        message: `Visitante: ${visitorName} — Apto ${apartment.number}`,
        direction,
        timestamp: new Date(),
      })
    } catch (_) {}

    return created(res, { log }, 'Visitante registrado com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Listar logs de acesso
const getAccessLogs = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query)
    const filter = {}

    if (req.query.type)        filter.type = req.query.type
    if (req.query.direction)   filter.direction = req.query.direction
    if (req.query.apartmentId) filter.apartment = req.query.apartmentId

    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {}
      if (req.query.startDate) filter.createdAt.$gte = new Date(req.query.startDate)
      if (req.query.endDate)   filter.createdAt.$lte = new Date(req.query.endDate)
    }

    const [logs, total] = await Promise.all([
      AccessLog.find(filter)
        .populate('user', 'name avatar')
        .populate('apartment', 'number block')
        .populate('authorizedBy', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      AccessLog.countDocuments(filter),
    ])

    return success(res, paginatedResponse(logs, total, page, limit))
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Meu histórico de acessos
const getMyAccessLogs = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query)

    const [logs, total] = await Promise.all([
      AccessLog.find({ user: req.user._id })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      AccessLog.countDocuments({ user: req.user._id }),
    ])

    return success(res, paginatedResponse(logs, total, page, limit))
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Regenerar QR Code do morador
const regenerateQRCode = async (req, res) => {
  try {
    const crypto = require('crypto')
    const QRCode = require('qrcode')

    const user = await User.findById(req.user._id)
    if (!user) return notFound(res, 'Usuário não encontrado')

    const qrToken = crypto.randomBytes(32).toString('hex')
    const qrCodeUrl = await QRCode.toDataURL(qrToken)

    user.qrToken = qrToken
    user.qrCode = qrCodeUrl
    await user.save()

    return success(res, { qrCode: qrCodeUrl }, 'QR Code regenerado com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

module.exports = {
  validateQRCode,
  registerVisitor,
  getAccessLogs,
  getMyAccessLogs,
  regenerateQRCode,
}