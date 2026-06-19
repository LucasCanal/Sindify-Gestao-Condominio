const Package = require('../models/Package')
const Apartment = require('../models/Apartment')
const User = require('../models/User')
const { success, created, notFound, badRequest } = require('../utils/apiResponse')
const { getPagination, paginatedResponse } = require('../utils/pagination')
const { getIO } = require('../config/socket')

// Porteiro registra encomenda
const createPackage = async (req, res) => {
  try {
    const { recipientName, apartmentId, sender, trackingCode, notes } = req.body

    const apartment = await Apartment.findById(apartmentId)
    if (!apartment) return notFound(res, 'Apartamento não encontrado')

    // Tenta encontrar o morador pelo nome no apartamento
    const recipient = await User.findOne({
      apartment: apartmentId,
      name: new RegExp(recipientName, 'i'),
    })

    const pkg = await Package.create({
      recipientName,
      apartment: apartmentId,
      recipient: recipient?._id || null,
      sender,
      trackingCode,
      notes,
      photo: req.file?.path || null,
      receivedBy: req.user._id,
    })

    // Notifica o apartamento em tempo real via Socket.io
    try {
      const io = getIO()
      io.to(`apartment:${apartmentId}`).emit('package:new', {
        message: `Nova encomenda para ${recipientName}`,
        package: pkg,
      })
    } catch (_) {}

    return created(res, { package: pkg }, 'Encomenda registrada com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Listar todas as encomendas (síndico/porteiro)
const getPackages = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query)
    const filter = {}

    if (req.query.status) filter.status = req.query.status
    if (req.query.apartmentId) filter.apartment = req.query.apartmentId

    const [packages, total] = await Promise.all([
      Package.find(filter)
        .populate('apartment', 'number block')
        .populate('recipient', 'name email')
        .populate('receivedBy', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Package.countDocuments(filter),
    ])

    return success(res, paginatedResponse(packages, total, page, limit))
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Morador vê suas encomendas
const getMyPackages = async (req, res) => {
  try {
    const packages = await Package.find({
      apartment: req.user.apartment,
    })
      .populate('receivedBy', 'name')
      .sort({ createdAt: -1 })

    return success(res, { packages })
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Marcar como retirada
const withdrawPackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id)
    if (!pkg) return notFound(res, 'Encomenda não encontrada')

    if (pkg.status !== 'aguardando') {
      return badRequest(res, 'Encomenda já foi retirada ou devolvida')
    }

    pkg.status = 'retirado'
    pkg.withdrawnBy = req.user._id
    pkg.withdrawnAt = new Date()
    await pkg.save()

    return success(res, { package: pkg }, 'Encomenda marcada como retirada')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Marcar como devolvida
const returnPackage = async (req, res) => {
  try {
    const pkg = await Package.findByIdAndUpdate(
      req.params.id,
      { status: 'devolvido' },
      { new: true }
    )

    if (!pkg) return notFound(res, 'Encomenda não encontrada')
    return success(res, { package: pkg }, 'Encomenda marcada como devolvida')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

module.exports = {
  createPackage,
  getPackages,
  getMyPackages,
  withdrawPackage,
  returnPackage,
}