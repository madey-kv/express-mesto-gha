const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');
const {
  validationError, notFoundError, conflictError, unauthorised,
} = require('../errors/errors');

module.exports.getUsers = (req, res, next) => {
  Users.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next(err));
};

module.exports.getUserMe = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  Users.find({
    name,
    about,
    avatar,
    email,
    password,
  })
    .then((user) => {
      if (!user) {
        next(new Error('NotFound'));
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(notFoundError).send({ message: 'Пользователь не найден' });
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  Users.findOne({ email })
    .then((user) => {
      if (user) {
        next(new Error(`Пользователь с адресом ${email} уже существует`));
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => Users.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => Users.findOne({ _id: user._id }))
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(validationError).send({
          message: 'Переданы некорректные данные',
        });
      } else if (err.code === 11000) {
        res.status(conflictError).send({
          message: 'Данный email уже зарегистрирован',
        });
      } else {
        next(err);
      }
    });
};

module.exports.getUserById = (req, res, next) => {
  Users.findById(req.params.userId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(notFoundError).send({ message: 'Пользователь не найден' });
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(validationError).send({
          message: 'Переданы некорректные данные',
        });
      }
      return next(err);
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(notFoundError).send({ message: 'Пользователь не найден' });
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(validationError).send({
          message: 'Переданы некорректные данные',
        });
      }
      return next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  Users.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(notFoundError).send({ message: 'Пользователь не найден' });
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(validationError).send({
          message: 'Переданы некорректные данные',
        });
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(validationError).send({
          message: 'Переданы некорректные данные',
        });
      } else if (err.message === 'Необходима авторизация') {
        res.status(unauthorised).send({
          message: 'Пожалуйста, войдите в личный кабинет',
        });
      }
      return next(err);
    });
};
