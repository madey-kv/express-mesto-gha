const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/UnauthorizedError');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'very-secret-key');
  } catch (err) {
    throw new UnauthorizedError('Требуется авторизация');
  }

  req.user = payload;
  next();
};
