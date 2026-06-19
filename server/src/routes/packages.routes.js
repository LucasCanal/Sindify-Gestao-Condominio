const express = require('express')
const router = express.Router()
const {
  createPackage,
  getPackages,
  getMyPackages,
  withdrawPackage,
  returnPackage,
} = require('../controllers/packages.controller')
const auth = require('../middlewares/auth.middleware')
const role = require('../middlewares/role.middleware')

router.use(auth)

router.get('/',                role(['sindico', 'porteiro']), getPackages)
router.get('/me',              getMyPackages)
router.post('/',               role(['sindico', 'porteiro']), createPackage)
router.patch('/:id/withdraw',  withdrawPackage)
router.patch('/:id/return',    role(['sindico', 'porteiro']), returnPackage)

module.exports = router