const Finance = require('../models/Finance')
const { success, created, notFound } = require('../utils/apiResponse')
const { getPagination, paginatedResponse } = require('../utils/pagination')

// Criar lançamento
const createTransaction = async (req, res) => {
  try {
    const { type, category, description, amount, date, notes, apartmentId } = req.body

    const transaction = await Finance.create({
      type,
      category,
      description,
      amount,
      date,
      notes,
      apartment: apartmentId || null,
      attachment: req.file?.path || null,
      createdBy: req.user._id,
    })

    return created(res, { transaction }, 'Lançamento criado com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Listar lançamentos com filtros
const getTransactions = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query)
    const filter = {}

    if (req.query.type)     filter.type = req.query.type
    if (req.query.category) filter.category = req.query.category

    // Filtro por período
    if (req.query.startDate || req.query.endDate) {
      filter.date = {}
      if (req.query.startDate) filter.date.$gte = new Date(req.query.startDate)
      if (req.query.endDate)   filter.date.$lte = new Date(req.query.endDate)
    }

    const [transactions, total] = await Promise.all([
      Finance.find(filter)
        .populate('createdBy', 'name')
        .populate('apartment', 'number block')
        .skip(skip)
        .limit(limit)
        .sort({ date: -1 }),
      Finance.countDocuments(filter),
    ])

    return success(res, paginatedResponse(transactions, total, page, limit))
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Resumo financeiro (dashboard)
const getSummary = async (req, res) => {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth   = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const [receitas, despesas, historico] = await Promise.all([
      // Total de receitas do mês
      Finance.aggregate([
        { $match: { type: 'receita', date: { $gte: startOfMonth, $lte: endOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),

      // Total de despesas do mês
      Finance.aggregate([
        { $match: { type: 'despesa', date: { $gte: startOfMonth, $lte: endOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),

      // Últimos 6 meses para gráfico
      Finance.aggregate([
        {
          $match: {
            date: {
              $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1),
            },
          },
        },
        {
          $group: {
            _id: {
              year:  { $year: '$date' },
              month: { $month: '$date' },
              type:  '$type',
            },
            total: { $sum: '$amount' },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
    ])

    const totalReceitas = receitas[0]?.total || 0
    const totalDespesas = despesas[0]?.total || 0

    return success(res, {
      mes: {
        receitas: totalReceitas,
        despesas: totalDespesas,
        saldo: totalReceitas - totalDespesas,
      },
      historico,
    })
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Buscar lançamento por ID
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Finance.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('apartment', 'number block')

    if (!transaction) return notFound(res, 'Lançamento não encontrado')
    return success(res, { transaction })
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Atualizar lançamento
const updateTransaction = async (req, res) => {
  try {
    const { type, category, description, amount, date, notes } = req.body

    const transaction = await Finance.findByIdAndUpdate(
      req.params.id,
      { type, category, description, amount, date, notes },
      { new: true, runValidators: true }
    )

    if (!transaction) return notFound(res, 'Lançamento não encontrado')
    return success(res, { transaction }, 'Lançamento atualizado com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Deletar lançamento
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Finance.findByIdAndDelete(req.params.id)
    if (!transaction) return notFound(res, 'Lançamento não encontrado')
    return success(res, {}, 'Lançamento deletado com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

module.exports = {
  createTransaction,
  getTransactions,
  getSummary,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
}