const express = require('express')
const router = express.Router()
const {
  createVote,
  getVotes,
  getVoteById,
  castVote,
  closeVote,
} = require('../controllers/votes.controller')
const auth = require('../middlewares/auth.middleware')
const role = require('../middlewares/role.middleware')

router.use(auth)

router.get('/',              getVotes)
router.get('/:id',           getVoteById)
router.post('/',             role(['sindico']), createVote)
router.post('/:id/vote',     castVote)
router.patch('/:id/close',   role(['sindico']), closeVote)

module.exports = router