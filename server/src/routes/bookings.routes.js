const express = require('express')
const router = express.Router()
const {
  createSpace,
  getSpaces,
  createBooking,
  getBookings,
  getMyBookings,
  cancelBooking,
  checkAvailability,
} = require('../controllers/bookings.controller')
const auth = require('../middlewares/auth.middleware')
const role = require('../middlewares/role.middleware')

router.use(auth)

// Espaços
router.get('/spaces',         getSpaces)
router.post('/spaces',        role(['sindico']), createSpace)

// Reservas
router.get('/availability',   checkAvailability)
router.get('/',               role(['sindico', 'zelador']), getBookings)
router.get('/me',             getMyBookings)
router.post('/',              createBooking)
router.patch('/:id/cancel',   cancelBooking)

module.exports = router