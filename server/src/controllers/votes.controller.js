const Vote = require('../models/Vote')
const { success, created, notFound, badRequest } = require('../utils/apiResponse')
const { getPagination, paginatedResponse } = require('../utils/pagination')

// Criar enquete (síndico)
const createVote = async (req, res) => {
  try {
    const { title, description, options, anonymous, expiresAt } = req.body

    if (!options || options.length < 2) {
      return badRequest(res, 'Informe pelo menos 2 opções')
    }

    const vote = await Vote.create({
      title,
      description,
      anonymous,
      expiresAt,
      createdBy: req.user._id,
      options: options.map((label) => ({ label, votes: [] })),
    })

    return created(res, { vote }, 'Enquete criada com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Listar enquetes
const getVotes = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query)
    const filter = {}

    if (req.query.status) filter.status = req.query.status

    const [votes, total] = await Promise.all([
      Vote.find(filter)
        .populate('createdBy', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Vote.countDocuments(filter),
    ])

    return success(res, paginatedResponse(votes, total, page, limit))
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Buscar enquete por ID
const getVoteById = async (req, res) => {
  try {
    const vote = await Vote.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('options.votes', 'name')

    if (!vote) return notFound(res, 'Enquete não encontrada')
    return success(res, { vote })
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Votar
const castVote = async (req, res) => {
  try {
    const { optionIndex } = req.body
    const vote = await Vote.findById(req.params.id)

    if (!vote) return notFound(res, 'Enquete não encontrada')
    if (vote.status === 'encerrada') return badRequest(res, 'Enquete encerrada')

    if (vote.expiresAt && new Date() > vote.expiresAt) {
      vote.status = 'encerrada'
      await vote.save()
      return badRequest(res, 'Enquete expirada')
    }

    // Verifica se já votou em alguma opção
    const alreadyVoted = vote.options.some((opt) =>
      opt.votes.map((v) => v.toString()).includes(req.user._id.toString())
    )

    if (alreadyVoted) return badRequest(res, 'Você já votou nesta enquete')

    if (optionIndex < 0 || optionIndex >= vote.options.length) {
      return badRequest(res, 'Opção inválida')
    }

    vote.options[optionIndex].votes.push(req.user._id)
    await vote.save()

    return success(res, { vote }, 'Voto registrado com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Encerrar enquete (síndico)
const closeVote = async (req, res) => {
  try {
    const vote = await Vote.findByIdAndUpdate(
      req.params.id,
      { status: 'encerrada' },
      { new: true }
    )

    if (!vote) return notFound(res, 'Enquete não encontrada')
    return success(res, { vote }, 'Enquete encerrada com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

module.exports = { createVote, getVotes, getVoteById, castVote, closeVote }