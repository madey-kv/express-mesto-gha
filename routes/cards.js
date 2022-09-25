const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getCards, createCard, likeCard, dislikeCard, deleteCard,
} = require('../controllers/cards');

router.get('/', auth, getCards);
router.post('/', auth, createCard);
router.put('/:cardId/likes', auth, likeCard);
router.delete('/:cardId/likes', auth, dislikeCard);
router.delete('/:cardId', auth, deleteCard);

module.exports = router;
