const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const {
  registerValid,
  loginValid,
} = require('./middlewares/validationJoi');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.post('/signup', registerValid, createUser);
app.post('/signin', loginValid, login);

app.use('/users', routerUsers);
app.use('/cards', routerCards);
app.use((req, res) => {
  res.status(404).send({ message: 'Роутер не найден!' });
});

app.use(auth);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Works on ${PORT}`);
});
