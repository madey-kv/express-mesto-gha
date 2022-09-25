const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getUsers, getUserById, updateUserInfo, updateAvatar, getUserMe,
} = require('../controllers/users');

router.get('/', auth, getUsers);
router.get('/me', auth, getUserMe);
router.get('/:userId', auth, getUserById);
router.patch('/me', auth, updateUserInfo);
router.patch('/me/avatar', auth, updateAvatar);

module.exports = router;
