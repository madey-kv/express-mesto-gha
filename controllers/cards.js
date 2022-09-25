const Cards = require('../models/card');
const { validationError, notFoundError, defaultError } = require('../errors/errors');

module.exports.getCards = (req, res, next) => {
  Cards.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Cards.create({ name, link, owner: ownerId })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(validationError)
          .send({ message: "Переданы некорректные данные'" });
      } else {
        res.status(defaultError).send({ message: 'Произошла ошибка' });
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(notFoundError).send({ message: 'Карточка не найдена' });
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(validationError).send({
          message: 'Переданы некорректные данные',
        });
      } else {
        res.status(defaultError).send({ message: 'Произошла ошибка' });
      }
      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(notFoundError).send({ message: 'Карточка не найдена' });
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(validationError).send({
          message: 'Переданы некорректные данные',
        });
      } else {
        res.status(defaultError).send({ message: 'Произошла ошибка' });
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Cards.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(notFoundError).send({ message: 'Карточка не найдена' });
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(validationError).send({
          message: 'Переданы некорректные данные',
        });
      } else {
        res.status(defaultError).send({ message: 'Произошла ошибка' });
      }
      return next(err);
    });
};
