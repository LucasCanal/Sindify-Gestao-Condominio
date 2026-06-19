const Booking = require('../models/Booking')
const Space = require('../models/Space')
const { success, created, notFound, badRequest } = require('../utils/apiResponse')
const { getPagination, paginatedResponse } = require('../utils/pagination')

// Criar espaço (síndico)
const createSpace = async (req, res) => {
  try {
    const { name, description, capacity, rules, availableDays, openTime, closeTime } = req.body

    const space = await Space.create({
      name,
      description,
      capacity,
      rules,
      availableDays,
      openTime,
      closeTime,
    })

    return created(res, { space }, 'Espaço criado com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Listar espaços
const getSpaces = async (req, res) => {
  try {
    const spaces = await Space.find({ active: true }).sort({ name: 1 })
    return success(res, { spaces })
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Criar reserva
const createBooking = async (req, res) => {
  try {
    const { spaceId, date, startTime, endTime, guests, notes } = req.body

    const space = await Space.findById(spaceId)
    if (!space) return notFound(res, 'Espaço não encontrado')
    if (!space.active) return badRequest(res, 'Espaço inativo')

    // Verifica se o dia da semana está disponível
    const dayOfWeek = new Date(date).getDay()
    if (!space.availableDays.includes(dayOfWeek)) {
      return badRequest(res, 'Espaço não disponível neste dia da semana')
    }

    // Verifica conflito de horário
    const conflict = await Booking.findOne({
      space: spaceId,
      date: new Date(date),
      status: { $in: ['confirmada', 'pendente'] },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      ],
    })

    if (conflict) {
      return badRequest(res, 'Horário já reservado para este espaço')
    }

    const booking = await Booking.create({
      space: spaceId,
      resident: req.user._id,
      apartment: req.user.apartment,
      date: new Date(date),
      startTime,
      endTime,
      guests,
      notes,
    })

    await booking.populate(['space', { path: 'resident', select: 'name email' }])

    return created(res, { booking }, 'Reserva criada com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Listar todas as reservas (síndico)
const getBookings = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query)
    const filter = {}

    if (req.query.spaceId) filter.space = req.query.spaceId
    if (req.query.status)  filter.status = req.query.status
    if (req.query.date)    filter.date = new Date(req.query.date)

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('space', 'name')
        .populate('resident', 'name email')
        .populate('apartment', 'number block')
        .skip(skip)
        .limit(limit)
        .sort({ date: 1, startTime: 1 }),
      Booking.countDocuments(filter),
    ])

    return success(res, paginatedResponse(bookings, total, page, limit))
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Minhas reservas
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ resident: req.user._id })
      .populate('space', 'name openTime closeTime')
      .sort({ date: -1 })

    return success(res, { bookings })
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Cancelar reserva
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) return notFound(res, 'Reserva não encontrada')

    // Morador só cancela a própria reserva
    const isSindico = req.user.role === 'sindico'
    const isOwner = booking.resident.toString() === req.user._id.toString()

    if (!isSindico && !isOwner) {
      return res.status(403).json({ ok: false, message: 'Acesso negado' })
    }

    if (booking.status === 'cancelada') {
      return badRequest(res, 'Reserva já está cancelada')
    }

    booking.status = 'cancelada'
    await booking.save()

    return success(res, { booking }, 'Reserva cancelada com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Verificar disponibilidade de um espaço numa data
const checkAvailability = async (req, res) => {
  try {
    const { spaceId, date } = req.query

    const bookings = await Booking.find({
      space: spaceId,
      date: new Date(date),
      status: { $in: ['confirmada', 'pendente'] },
    }).select('startTime endTime resident')

    return success(res, { bookings })
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

module.exports = {
  createSpace,
  getSpaces,
  createBooking,
  getBookings,
  getMyBookings,
  cancelBooking,
  checkAvailability,
}