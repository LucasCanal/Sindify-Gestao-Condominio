const Notice = require('../models/Notice')
const { success, created, notFound } = require('../utils/apiResponse')
const { getPagination, paginatedResponse } = require('../utils/pagination')
const { getIO } = require('../config/socket')

// Criar aviso (síndico)
const createNotice = async (req, res) => {
  try {
    const { title, content, category, pinned, expiresAt } = req.body

    const notice = await Notice.create({
      title,
      content,
      category,
      pinned,
      expiresAt,
      author: req.user._id,
    })

    // Notifica todos em tempo real
    try {
      const io = getIO()
      io.emit('notice:new', {
        message: `Novo aviso: ${title}`,
        notice,
      })
    } catch (_) {}

    return created(res, { notice }, 'Aviso criado com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Listar avisos
const getNotices = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query)
    const filter = {}

    if (req.query.category) filter.category = req.query.category

    // Remove avisos expirados
    filter.$or = [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } },
    ]

    const [notices, total] = await Promise.all([
      Notice.find(filter)
        .populate('author', 'name role')
        .skip(skip)
        .limit(limit)
        .sort({ pinned: -1, createdAt: -1 }),
      Notice.countDocuments(filter),
    ])

    return success(res, paginatedResponse(notices, total, page, limit))
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Buscar aviso por ID
const getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id)
      .populate('author', 'name role')

    if (!notice) return notFound(res, 'Aviso não encontrado')
    return success(res, { notice })
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Alterna o status de leitura do aviso (lido <-> não lido)
const toggleRead = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id)
    if (!notice) return notFound(res, 'Aviso não encontrado')

    const userId = req.user._id.toString()
    const alreadyRead = notice.readBy.some(
      (r) => r.user.toString() === userId
    )

    if (alreadyRead) {
      notice.readBy = notice.readBy.filter(
        (r) => r.user.toString() !== userId
      )
    } else {
      notice.readBy.push({ user: req.user._id })
    }

    await notice.save()

    return success(
      res,
      { read: !alreadyRead },
      alreadyRead ? 'Aviso marcado como não lido' : 'Aviso marcado como lido'
    )
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Atualizar aviso
const updateNotice = async (req, res) => {
  try {
    const { title, content, category, pinned, expiresAt } = req.body

    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      { title, content, category, pinned, expiresAt },
      { new: true, runValidators: true }
    )

    if (!notice) return notFound(res, 'Aviso não encontrado')
    return success(res, { notice }, 'Aviso atualizado com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Deletar aviso
const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id)
    if (!notice) return notFound(res, 'Aviso não encontrado')
    return success(res, {}, 'Aviso deletado com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

module.exports = {
  createNotice,
  getNotices,
  getNoticeById,
  toggleRead,
  updateNotice,
  deleteNotice,
}