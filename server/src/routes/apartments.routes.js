const express = require('express')
const router = express.Router()

const {
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
  removeResidentFromMyUnit,
  addEmergencyContact,
  removeEmergencyContact,
} = require('../controllers/apartments.controller')

const auth = require('../middlewares/auth.middleware')
const role = require('../middlewares/role.middleware')

// Todos precisam estar autenticados
router.use(auth)


// ========================
// MY UNIT (usuário comum)
// ========================
router.get('/my-unit', getMyUnit)
router.post('/my-unit', createMyUnit)

// Moradores da própria unidade
router.delete('/my-unit/residents/:residentId', removeResidentFromMyUnit)

// Visitantes
router.post('/my-unit/visitors', addVisitor)
router.delete('/my-unit/visitors/:visitorId', removeVisitor)

// Pets
router.post('/my-unit/pets', addPet)
router.delete('/my-unit/pets/:petId', removePet)

// Veículos
router.post('/my-unit/vehicles', addVehicle)
router.delete('/my-unit/vehicles/:vehicleId', removeVehicle)

// Contatos de emergência
router.post('/my-unit/emergency-contacts', addEmergencyContact)
router.delete('/my-unit/emergency-contacts/:contactId', removeEmergencyContact)


// ========================
// ROTAS GERAIS
// ========================
router.get('/', getApartments)
router.get('/:id', getApartmentById)


// ========================
// SÍNDICO
// ========================
router.post('/', role(['sindico']), createApartment)
router.put('/:id', role(['sindico']), updateApartment)

// moradores por apartamento (síndico)
router.post('/:id/residents', role(['sindico']), addResident)
router.delete('/:id/residents/:userId', role(['sindico']), removeResident)


module.exports = router