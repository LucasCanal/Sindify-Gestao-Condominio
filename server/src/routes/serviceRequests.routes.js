const express = require('express')
const router = express.Router()
const {
  createServiceRequest,
  getServiceRequests,
  getMyServiceRequests,
  getServiceRequestById,
  updateServiceRequest,
  cancelServiceRequest,
} = require('../controllers/serviceRequests.controller')
const auth = require('../middlewares/auth.middleware')
const role = require('../middlewares/role.middleware')

router.use(auth)

router.get('/',              role(['sindico', 'zelador']), getServiceRequests)
router.get('/me',            getMyServiceRequests)
router.get('/:id',           getServiceRequestById)
router.post('/',             createServiceRequest)
router.put('/:id',           role(['sindico', 'zelador']), updateServiceRequest)
router.patch('/:id/cancel',  cancelServiceRequest)

module.exports = router