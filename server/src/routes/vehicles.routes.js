const express = require('express')
const router = express.Router()

const {
  createVehicle,
  getVehicles,
  getMyVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  addAuthorizedDriver,
  removeAuthorizedDriver,
} = require('../controllers/vehicles.controller')

const auth = require('../middlewares/auth.middleware')
const role = require('../middlewares/role.middleware')

router.use(auth)

// Veículos
router.get(
  '/',
  role(['sindico', 'porteiro', 'zelador']),
  getVehicles
)

router.get('/me', getMyVehicles)

router.get('/:id', getVehicleById)

router.post('/', createVehicle)

router.put('/:id', updateVehicle)

router.delete('/:id', deleteVehicle)

// Autorizados do veículo
router.post(
  '/:id/authorized-drivers',
  addAuthorizedDriver
)

router.delete(
  '/:id/authorized-drivers/:driverId',
  removeAuthorizedDriver
)

module.exports = router