const Users = require('../models/user');
const ValidationError = 400;
const NotFoundError = 404;
const DefaultError = 500;

module.exports.getUser = (req, res) => {
  Users.find({})
    .then(users => res.send({ data: users }))
    .catch(() => res.status(DefaultError).send({ message: 'Ошибка по-умолчанию' }));
};

module.exports.getUserId = (req, res) => {
  Users.findById(req.params.userId)
    .orFail(() => {
      res.status(NotFoundError).send({ message: 'Пользователь не найден' });
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.statusCode === ValidationError) {
        return res.status(ValidationError).send({ message: 'Переданы некорректные данные' })
      } else if (err.statusCode === NotFoundError) {
        return res.status(NotFoundError).send({ message: 'Пользователь не найден' })
      }
      else {
        return res.status(DefaultError).send({ message: 'Ошибка по умолчанию' })
      }
    })
};
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  Users.create({ name, about, avatar })
    .then(user => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.statusCode === 400) {
        return res.status(400).send({ message: 'Переданы некорректные данные' })
      }
      else {
        return res.status(500).send({ message: 'Ошибка по умолчанию' })
      }
    })
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      res.status(NotFoundError).send({ message: 'Пользователь не найден' });
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.statusCode === ValidationError) {
        return res.status(ValidationError).send({ message: 'Переданы некорректные данные' })
      } else if (err.statusCode === NotFoundError) {
        return res.status(NotFoundError).send({ message: 'Пользователь не найден' })
      }
      else {
        return res.status(DefaultError).send({ message: 'Ошибка по умолчанию' })
      }
    })
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  Users.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      res.status(NotFoundError).send({ message: 'Пользователь не найден' });
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.statusCode === ValidationError) {
        return res.status(ValidationError).send({ message: 'Переданы некорректные данные' })
      } else if (err.statusCode === NotFoundError) {
        return res.status(NotFoundError).send({ message: 'Пользователь не найден' })
      }
      else {
        return res.status(DefaultError).send({ message: 'Ошибка по умолчанию' })
      }
    })
};