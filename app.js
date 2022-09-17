const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '63236843588de69fb3bc3534'
  };

  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use('/users', routerUsers);
app.use('/cards', routerCards);
app.use((req, res) => {
  res.status(404).send({ message: "Роутер не найден!" });
});


app.listen(PORT, () => {
  console.log(`Works on ${PORT}`);
});