const Cards = require('../models/card');

const ValidationError = 400;
const NotFoundError = 404;
const DefaultError = 500;

module.exports.getCard = (req, res) => {
  Cards.find({})
    .then(cards => res.send({ data: cards }))
    .catch(err => {
      if (err.statusCode === NotFoundError) {
        return res.status(NotFoundError).send({ message: 'Не найдено ни одной карточки' })
      }
      return res.status(DefaultError).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Cards.create({ name, link, owner: ownerId })
    .then(card => res.send({ data: card }))
    .catch(err => {
      if (err.statusCode === ValidationError) {
        return res.status(ValidationError).send({ message: 'Переданы некорректные данные' })
      }
      return res.status(DefaultError).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.likeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      res.status(NotFoundError).send({ message: 'Карточка не найдена' });
    })
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err.statusCode === ValidationError) {
        return res.status(ValidationError).send({ message: 'Переданы некорректные данные' })
      } else if (err.statusCode === NotFoundError) {
        return res.status(NotFoundError).send({ message: 'Карточка не найдена' })
      }
      else {
        return res.status(DefaultError).send({ message: 'Ошибка по умолчанию' })
      }
    })
}

module.exports.dislikeCard = (req, res) => {
  Cards.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      res.status(NotFoundError).send({ message: 'Карточка не найдена' });
    })
    .then(card => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.statusCode === ValidationError) {
        return res.status(ValidationError).send({ message: 'Переданы некорректные данные' })
      } else if (err.statusCode === NotFoundError) {
        return res.status(NotFoundError).send({ message: 'Карточка не найдена' })
      }
      else {
        return res.status(DefaultError).send({ message: 'Ошибка по умолчанию' })
      }
    })
}

module.exports.deleteCard = (req, res) => {
  Cards.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      res.status(NotFoundError).send({ message: 'Карточка не найдена' });
    })
    .then(card => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.statusCode === ValidationError) {
        return res.status(ValidationError).send({ message: 'Переданы некорректные данные' })
      } else if (err.statusCode === NotFoundError) {
        return res.status(NotFoundError).send({ message: 'Карточка не найдена' })
      }
      else {
        return res.status(DefaultError).send({ message: 'Ошибка по умолчанию' })
      }
    })
};