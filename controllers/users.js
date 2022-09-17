const Users = require('../models/user');
const ValidationError = 400;
const NotFoundError = 404;
const DefaultError = 500;

module.exports.getUser = (req, res) => {
  Users.find({})
    .then(users => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.getUserId = (req, res) => {
  Users.findById(req.params.userId)
    .orFail(() => {
      res.status(NotFoundError).send({ message: 'Пользователь не найден' });
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({
          message: "Пользователь по указанному _id не найден.",
        });
      } else {
        res.status(404).send({ message: "Произошла ошибка" });
      }
    });
};
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  Users.create({ name, about, avatar })
    .then(user => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: "Переданы некорректные данные при создании пользователя.",
        });
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      res.status(NotFoundError).send({ message: 'Пользователь не найден' });
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: "Переданы некорректные данные при обновлении профиля.",
        });
      } else if (err.name === "CastError") {
        res.status(404).send({
          message: "Пользователь по указанному _id не найден.",
        });
      } else {
        res.status(500).send({
          message:
            "Данные не прошли валидацию. Либо произошло что-то совсем немыслимое",
        });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  Users.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      res.status(NotFoundError).send({ message: 'Пользователь не найден' });
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: "Переданы некорректные данные при обновлении профиля.",
        });
      } else if (err.name === "CastError") {
        res.status(404).send({
          message: "Пользователь по указанному _id не найден.",
        });
      } else {
        res.status(500).send({
          message:
            "Данные не прошли валидацию. Либо произошло что-то совсем немыслимое",
        });
      }
    });
};