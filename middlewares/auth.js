const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new Error('Необходима авторизация'));
  }
  const token = String(req.headers.authorization).replace('Bearer ', '');

  let payload;

  try {

    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(new Error('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};
