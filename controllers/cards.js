const Cards = require('../models/card');

const ValidationError = 400;
const NotFoundError = 404;
const DefaultError = 500;

module.exports.getCard = (req, res) => {
  Cards.find({})
    .then(cards => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Cards.create({ name, link, owner: ownerId })
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(400)
          .send({ message: "Переданы некорректные данные карточки" });
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
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
      if (err.name === "CastError") {
        res.status(400).send({
          message: "Переданы некорректные данные для постановки лайка.",
        });
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
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
      if (err.name === "CastError") {
        res
          .status(400)
          .send({ message: "Переданы некорректные данные для снятия лайка." });
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
}

module.exports.deleteCard = (req, res) => {
  Cards.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      res.status(NotFoundError).send({ message: 'Карточка не найдена' });
    })
    .then(card => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({
          message: "Переданы некорректные данные.",
        });
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
};