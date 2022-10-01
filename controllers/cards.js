const Card = require('../models/card');
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require('../errors/errors');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Card.create({ name, link, owner: ownerId })
    .then((card) => {
      if (!card) {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError({ message: 'Переданы некорректные данные' }));
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => Card.findById(req.params.cardId)
  .orFail(() => next(new NotFoundError('Карточка с указанным _id не найдена.')))
  .then((card) => {
    if (card.owner.toString() !== req.user._id) {
      throw new ForbiddenError('Операция удаления карточки недоступна данному пользователю.');
    } else {
      Card.findByIdAndDelete(req.params.cardId)
        .then(() => res.send({ cardId: card._id }))
        .catch(next);
    }
  })
  .catch(next);

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка не найдена'));
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Карточка не найдена');
    })
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка не найдена'));
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};
