const Apartment = require('../models/Apartment')
const User = require('../models/User')
const { success, created, notFound, badRequest } = require('../utils/apiResponse')
const { getPagination, paginatedResponse } = require('../utils/pagination')

// Criar apartamento (síndico)
const createApartment = async (req, res) => {
  try {
    const { number, block, floor } = req.body

    const exists = await Apartment.findOne({ number, block })
    if (exists) {
      return badRequest(res, 'Apartamento já cadastrado')
    }

    const apartment = await Apartment.create({ number, block, floor })
    return created(res, { apartment }, 'Apartamento criado com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Listar todos os apartamentos
const getApartments = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query)

    const [apartments, total] = await Promise.all([
      Apartment.find({ active: true })
        .populate('residents', 'name email phone avatar')
        .populate('owner', 'name email')
        .skip(skip)
        .limit(limit)
        .sort({ block: 1, number: 1 }),
      Apartment.countDocuments({ active: true }),
    ])

    return success(res, paginatedResponse(apartments, total, page, limit))
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Buscar apartamento por ID
const getApartmentById = async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id)
      .populate('residents', 'name email phone avatar role')
      .populate('owner', 'name email')

    if (!apartment) return notFound(res, 'Apartamento não encontrado')

    return success(res, { apartment })
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Atualizar apartamento
const updateApartment = async (req, res) => {
  try {
    const { number, block, floor, active } = req.body

    const apartment = await Apartment.findByIdAndUpdate(
      req.params.id,
      { number, block, floor, active },
      { new: true, runValidators: true }
    )

    if (!apartment) return notFound(res, 'Apartamento não encontrado')

    return success(res, { apartment }, 'Apartamento atualizado com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Adicionar morador ao apartamento
const addResident = async (req, res) => {
  try {
    const { userId } = req.body

    const user = await User.findById(userId)
    if (!user) return notFound(res, 'Usuário não encontrado')

    const apartment = await Apartment.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { residents: userId } },
      { new: true }
    ).populate('residents', 'name email phone')

    if (!apartment) return notFound(res, 'Apartamento não encontrado')

    // Atualiza o apartamento no usuário também
    await User.findByIdAndUpdate(userId, { apartment: req.params.id })

    return success(res, { apartment }, 'Morador adicionado com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Remover morador do apartamento
const removeResident = async (req, res) => {
  try {
    const { userId } = req.params

    const apartment = await Apartment.findByIdAndUpdate(
      req.params.id,
      { $pull: { residents: userId } },
      { new: true }
    ).populate('residents', 'name email phone')

    if (!apartment) return notFound(res, 'Apartamento não encontrado')

    await User.findByIdAndUpdate(userId, { apartment: null })

    return success(res, { apartment }, 'Morador removido com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// Buscar apartamento do usuário logado
const getMyUnit = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return notFound(res, 'Usuário não encontrado')
    }

    if (!user.apartment) {
      return notFound(res, 'Usuário não possui apartamento vinculado')
    }

    const apartment = await Apartment.findById(user.apartment)
      .populate('residents', 'name email phone avatar')

    if (!apartment) {
      return notFound(res, 'Apartamento não encontrado')
    }

    return success(res, { apartment })
  } catch (e) {
    return res.status(500).json({
      ok: false,
      message: e.message,
    })
  }
}


// Morador cria e vincula sua própria unidade
const createMyUnit = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return notFound(res, 'Usuário não encontrado')

    if (user.apartment) {
      return badRequest(res, 'Você já possui uma unidade vinculada')
    }

    const { number, block, floor, area, type } = req.body

    const exists = await Apartment.findOne({ number, block })
    if (exists) {
      return badRequest(res, 'Este apartamento já está cadastrado')
    }

    const apartment = await Apartment.create({
      number,
      block,
      floor,
      area,
      type,
      owner: user._id,
      residents: [user._id],
    })

    user.apartment = apartment._id
    await user.save()

    return created(res, { apartment }, 'Unidade criada e vinculada com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}
// Função auxiliar: busca o apartamento vinculado ao usuário logado
const findMyApartment = async (req) => {
  const user = await User.findById(req.user.id)
  if (!user || !user.apartment) return null
  return user.apartment
}

// ===== VISITANTES =====

const addVisitor = async (req, res) => {
  try {
    const apartmentId = await findMyApartment(req)
    if (!apartmentId) return notFound(res, 'Você não possui unidade vinculada')

    const { name, authorizationDate } = req.body

    const apartment = await Apartment.findByIdAndUpdate(
      apartmentId,
      { $push: { visitors: { name, authorizationDate } } },
      { new: true, runValidators: true }
    )

    return created(res, { apartment }, 'Visitante adicionado com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

const removeVisitor = async (req, res) => {
  try {
    const apartmentId = await findMyApartment(req)
    if (!apartmentId) return notFound(res, 'Você não possui unidade vinculada')

    const { visitorId } = req.params

    const apartment = await Apartment.findByIdAndUpdate(
      apartmentId,
      { $pull: { visitors: { _id: visitorId } } },
      { new: true }
    )

    return success(res, { apartment }, 'Visitante removido com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// ===== PETS =====

const addPet = async (req, res) => {
  try {
    const apartmentId = await findMyApartment(req)
    if (!apartmentId) return notFound(res, 'Você não possui unidade vinculada')

    const { name, kind } = req.body

    const apartment = await Apartment.findByIdAndUpdate(
      apartmentId,
      { $push: { pets: { name, kind } } },
      { new: true, runValidators: true }
    )

    return created(res, { apartment }, 'Pet cadastrado com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

const removePet = async (req, res) => {
  try {
    const apartmentId = await findMyApartment(req)
    if (!apartmentId) return notFound(res, 'Você não possui unidade vinculada')

    const { petId } = req.params

    const apartment = await Apartment.findByIdAndUpdate(
      apartmentId,
      { $pull: { pets: { _id: petId } } },
      { new: true }
    )

    return success(res, { apartment }, 'Pet removido com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// ===== MORADORES (pela própria unidade) =====

const addResidentToMyUnit = async (req, res) => {
  try {
    const apartmentId = await findMyApartment(req)
    if (!apartmentId) return notFound(res, 'Você não possui unidade vinculada')

    const { name, role } = req.body

    const apartment = await Apartment.findByIdAndUpdate(
      apartmentId,
      { $push: { residentsInfo: { name, role } } },
      { new: true, runValidators: true }
    )

    return created(res, { apartment }, 'Morador adicionado com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// ===== CONTATOS DE EMERGÊNCIA =====

const addEmergencyContact = async (req, res) => {
  try {
    const apartmentId = await findMyApartment(req)
    if (!apartmentId) return notFound(res, 'Você não possui unidade vinculada')

    const { name, phone, kinship } = req.body

    const apartment = await Apartment.findByIdAndUpdate(
      apartmentId,
      { $push: { emergencyContacts: { name, phone, kinship } } },
      { new: true, runValidators: true }
    )

    return created(res, { apartment }, 'Contato de emergência adicionado com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

const removeEmergencyContact = async (req, res) => {
  try {
    const apartmentId = await findMyApartment(req)
    if (!apartmentId) return notFound(res, 'Você não possui unidade vinculada')

    const { contactId } = req.params

    const apartment = await Apartment.findByIdAndUpdate(
      apartmentId,
      { $pull: { emergencyContacts: { _id: contactId } } },
      { new: true }
    )

    return success(res, { apartment }, 'Contato de emergência removido com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// ===== CONTATO DE EMERGÊNCIA =====

const updateEmergencyContact = async (req, res) => {
  try {
    const apartmentId = await findMyApartment(req)
    if (!apartmentId) return notFound(res, 'Você não possui unidade vinculada')

    const { name, phone, kinship } = req.body

    const apartment = await Apartment.findByIdAndUpdate(
      apartmentId,
      { emergencyContact: { name, phone, kinship } },
      { new: true, runValidators: true }
    )

    return success(res, { apartment }, 'Contato de emergência atualizado com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

const removeResidentFromMyUnit = async (req, res) => {
  try {
    const apartmentId = await findMyApartment(req)
    if (!apartmentId) return notFound(res, 'Você não possui unidade vinculada')

    const { residentId } = req.params

    const apartment = await Apartment.findByIdAndUpdate(
      apartmentId,
      { $pull: { residentsInfo: { _id: residentId } } },
      { new: true }
    )

    return success(res, { apartment }, 'Morador removido com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

// ===== VEÍCULOS =====

const addVehicle = async (req, res) => {
  try {
    const apartmentId = await findMyApartment(req)
    if (!apartmentId) return notFound(res, 'Você não possui unidade vinculada')

    const { model, plate } = req.body

    const apartment = await Apartment.findByIdAndUpdate(
      apartmentId,
      { $push: { vehicles: { model, plate } } },
      { new: true, runValidators: true }
    )

    return created(res, { apartment }, 'Veículo cadastrado com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

const removeVehicle = async (req, res) => {
  try {
    const apartmentId = await findMyApartment(req)
    if (!apartmentId) return notFound(res, 'Você não possui unidade vinculada')

    const { vehicleId } = req.params

    const apartment = await Apartment.findByIdAndUpdate(
      apartmentId,
      { $pull: { vehicles: { _id: vehicleId } } },
      { new: true }
    )

    return success(res, { apartment }, 'Veículo removido com sucesso')
  } catch (e) {
    return res.status(500).json({ ok: false, message: e.message })
  }
}

module.exports = {
  createApartment,
  getApartments,
  getApartmentById,
  getMyUnit,
  updateApartment,
  addResident,
  removeResident,
  createMyUnit,
  addVisitor,
  removeVisitor,
  addPet,
  removePet,
  addVehicle,
  removeVehicle,
  addResidentToMyUnit,
  removeResidentFromMyUnit,
  addEmergencyContact,
  removeEmergencyContact,
  updateEmergencyContact,
}