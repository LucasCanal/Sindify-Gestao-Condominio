const Vehicle = require('../models/Vehicle')
const Apartment = require('../models/Apartment')
const User = require('../models/User')

const {
success,
created,
notFound,
badRequest,
forbidden,
} = require('../utils/apiResponse')

const {
getPagination,
paginatedResponse,
} = require('../utils/pagination')

// Cadastrar veículo
const createVehicle = async (req, res) => {
try {
const { plate, brand, model, color, parkingSpot } = req.body

if (!plate) {
  return badRequest(res, 'Placa é obrigatória')
}

const exists = await Vehicle.findOne({
  plate: plate.toUpperCase(),
  active: true,
})

if (exists) {
  return badRequest(res, 'Placa já cadastrada')
}

const user = await User.findById(req.user._id)

if (!user || !user.apartment) {
  return notFound(
    res,
    'Você não possui apartamento vinculado'
  )
}

const apartment = await Apartment.findById(user.apartment)

if (!apartment) {
  return notFound(res, 'Apartamento não encontrado')
}

const vehicle = await Vehicle.create({
  plate: plate.toUpperCase(),
  brand,
  model,
  color,
  parkingSpot,
  apartment: apartment._id,
  owner: user._id,
  photo: req.file?.path || null,
})

return created(
  res,
  { vehicle },
  'Veículo cadastrado com sucesso'
)

} catch (e) {
return res.status(500).json({
ok: false,
message: e.message,
})
}
}

// Listar todos os veículos (síndico/porteiro)
const getVehicles = async (req, res) => {
try {
const { page, limit, skip } = getPagination(req.query)

const filter = {
  active: true,
}

if (req.query.apartmentId) {
  filter.apartment = req.query.apartmentId
}

const [vehicles, total] = await Promise.all([
  Vehicle.find(filter)
    .populate('apartment', 'number block')
    .populate('owner', 'name email')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 }),

  Vehicle.countDocuments(filter),
])

return success(
  res,
  paginatedResponse(
    vehicles,
    total,
    page,
    limit
  )
)

} catch (e) {
return res.status(500).json({
ok: false,
message: e.message,
})
}
}

// Buscar veículos da minha unidade
const getMyVehicles = async (req, res) => {
try {
const user = await User.findById(req.user._id)

if (!user || !user.apartment) {
  return notFound(
    res,
    'Você não possui apartamento vinculado'
  )
}

const vehicles = await Vehicle.find({
  apartment: user.apartment,
  active: true,
})
  .populate('owner', 'name email')
  .sort({ createdAt: -1 })

return success(res, { vehicles })

} catch (e) {
return res.status(500).json({
ok: false,
message: e.message,
})
}
}

// Buscar veículo por ID
const getVehicleById = async (req, res) => {
try {
const vehicle = await Vehicle.findById(req.params.id)
.populate('apartment', 'number block')
.populate('owner', 'name email')

if (!vehicle) {
  return notFound(res, 'Veículo não encontrado')
}

return success(res, { vehicle })

} catch (e) {
return res.status(500).json({
ok: false,
message: e.message,
})
}
}

// Atualizar veículo
const updateVehicle = async (req, res) => {
try {
const { brand, model, color, parkingSpot } = req.body

const vehicle = await Vehicle.findById(req.params.id)

if (!vehicle) {
  return notFound(res, 'Veículo não encontrado')
}

const user = await User.findById(req.user._id)

if (!user || !user.apartment) {
  return forbidden(res, 'Acesso negado')
}

const sameApartment =
  vehicle.apartment.toString() ===
  user.apartment.toString()

if (!sameApartment) {
  return forbidden(
    res,
    'Você não pode editar este veículo'
  )
}

vehicle.brand = brand ?? vehicle.brand
vehicle.model = model ?? vehicle.model
vehicle.color = color ?? vehicle.color
vehicle.parkingSpot =
  parkingSpot ?? vehicle.parkingSpot

await vehicle.save()

return success(
  res,
  { vehicle },
  'Veículo atualizado com sucesso'
)

} catch (e) {
return res.status(500).json({
ok: false,
message: e.message,
})
}
}

// Remover veículo
const deleteVehicle = async (req, res) => {
try {
const vehicle = await Vehicle.findById(req.params.id)

if (!vehicle) {
  return notFound(res, 'Veículo não encontrado')
}

const user = await User.findById(req.user._id)

if (!user || !user.apartment) {
  return forbidden(res, 'Acesso negado')
}

const sameApartment =
  vehicle.apartment.toString() ===
  user.apartment.toString()

if (!sameApartment) {
  return forbidden(
    res,
    'Você não pode remover este veículo'
  )
}

vehicle.active = false
await vehicle.save()

return success(
  res,
  {},
  'Veículo removido com sucesso'
)

} catch (e) {
return res.status(500).json({
ok: false,
message: e.message,
})
}
}

// Adicionar autorizado ao veículo
const addAuthorizedDriver = async (req, res) => {
  try {
    const { name, phone, document } = req.body

    const vehicle = await Vehicle.findById(req.params.id)

    if (!vehicle) {
      return notFound(res, 'Veículo não encontrado')
    }

    const user = await User.findById(req.user._id)

    if (!user || !user.apartment) {
      return forbidden(res, 'Acesso negado')
    }

    const sameApartment =
      vehicle.apartment.toString() ===
      user.apartment.toString()

    if (!sameApartment) {
      return forbidden(
        res,
        'Você não pode alterar este veículo'
      )
    }

    vehicle.authorizedDrivers.push({
      name,
      phone,
      document,
    })

    await vehicle.save()

    return success(
      res,
      {
        authorizedDrivers:
          vehicle.authorizedDrivers,
      },
      'Autorizado adicionado com sucesso'
    )
  } catch (e) {
    return res.status(500).json({
      ok: false,
      message: e.message,
    })
  }
}

// Remover autorizado do veículo
const removeAuthorizedDriver = async (
  req,
  res
) => {
  try {
    const vehicle = await Vehicle.findById(
      req.params.id
    )

    if (!vehicle) {
      return notFound(res, 'Veículo não encontrado')
    }

    const user = await User.findById(req.user._id)

    if (!user || !user.apartment) {
      return forbidden(res, 'Acesso negado')
    }

    const sameApartment =
      vehicle.apartment.toString() ===
      user.apartment.toString()

    if (!sameApartment) {
      return forbidden(
        res,
        'Você não pode alterar este veículo'
      )
    }

    vehicle.authorizedDrivers =
      vehicle.authorizedDrivers.filter(
        driver =>
          driver._id.toString() !==
          req.params.driverId
      )

    await vehicle.save()

    return success(
      res,
      {},
      'Autorizado removido com sucesso'
    )
  } catch (e) {
    return res.status(500).json({
      ok: false,
      message: e.message,
    })
  }
}

module.exports = {
  createVehicle,
  getVehicles,
  getMyVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  addAuthorizedDriver,
  removeAuthorizedDriver,
}
