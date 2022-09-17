const Cards = require('../models/card');

module.exports.getCards = (req, res) => {
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
          .send({ message: "Переданы некорректные данные'" });
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
      res.status(404).send({ message: 'Карточка не найдена' });
    })
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({
          message: "Переданы некорректные данные'",
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
      res.status(404).send({ message: 'Карточка не найдена' });
    })
    .then(card => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(400)
          .send({ message: "Переданы некорректные данные'" });
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
}

module.exports.deleteCard = (req, res) => {
  Cards.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      res.status(404).send({ message: 'Карточка не найдена' });
    })
    .then(card => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({
          message: "Переданы некорректные данные'",
        });
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
};