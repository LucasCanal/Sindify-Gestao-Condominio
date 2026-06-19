const express = require('express')
const router = express.Router()
const {
  createNotice,
  getNotices,
  getNoticeById,
  markAsRead,
  updateNotice,
  deleteNotice,
} = require('../controllers/notices.controller')
const auth = require('../middlewares/auth.middleware')
const role = require('../middlewares/role.middleware')

router.use(auth)

router.get('/',               getNotices)
router.get('/:id',            getNoticeById)
router.post('/',              role(['sindico', 'conselheiro']), createNotice)
router.patch('/:id/read',     markAsRead)
router.put('/:id',            role(['sindico', 'conselheiro']), updateNotice)
router.delete('/:id',         role(['sindico']), deleteNotice)

module.exports = router