const express = require('express')
const router = express.Router()
const {
  getUsers,
  getUserById,
  updateProfile,
  changePassword,
  updateUserRole,
  toggleUserActive,
} = require('../controllers/users.controller')
const auth = require('../middlewares/auth.middleware')
const role = require('../middlewares/role.middleware')

router.use(auth)

router.get('/',                    role(['sindico']), getUsers)
router.get('/:id',                 role(['sindico']), getUserById)
router.put('/profile',             updateProfile)
router.patch('/change-password',   changePassword)
router.patch('/:id/role',          role(['sindico']), updateUserRole)
router.patch('/:id/toggle-active', role(['sindico']), toggleUserActive)

module.exports = router