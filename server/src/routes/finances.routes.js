const express = require('express')
const router = express.Router()
const {
  createTransaction,
  getTransactions,
  getSummary,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/finances.controller')
const auth = require('../middlewares/auth.middleware')
const role = require('../middlewares/role.middleware')

router.use(auth)

router.get('/summary',  role(['sindico', 'conselheiro']), getSummary)
router.get('/',         role(['sindico', 'conselheiro']), getTransactions)
router.get('/:id',      role(['sindico', 'conselheiro']), getTransactionById)
router.post('/',        role(['sindico']), createTransaction)
router.put('/:id',      role(['sindico']), updateTransaction)
router.delete('/:id',   role(['sindico']), deleteTransaction)

module.exports = router