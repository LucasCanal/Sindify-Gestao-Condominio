const express = require('express')
const router = express.Router()
const {
  validateQRCode,
  registerVisitor,
  getAccessLogs,
  getMyAccessLogs,
  regenerateQRCode,
} = require('../controllers/access.controller')
const auth = require('../middlewares/auth.middleware')
const role = require('../middlewares/role.middleware')

router.use(auth)

router.post('/validate-qr',   role(['porteiro', 'sindico']), validateQRCode)
router.post('/visitor',       role(['porteiro', 'sindico']), registerVisitor)
router.get('/',               role(['sindico', 'porteiro']), getAccessLogs)
router.get('/me',             getMyAccessLogs)
router.post('/regenerate-qr', regenerateQRCode)

module.exports = router