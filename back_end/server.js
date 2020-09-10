const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('dotenv').config();

let app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT;
const uri = process.env.URI;

// Configuration de la connexion avec la base de données
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Connexion avec la base de données réussie')
});

// Configuration des Routes
var usersRouter = require('./routes/users');
var cryptoCurrenciesRouter = require('./routes/crypto_currencies');
var pressReviewsRouter = require('./routes/press_reviews');

app.use('/users', usersRouter);
app.use('/cryptos', cryptoCurrenciesRouter);
app.use('/articles', pressReviewsRouter);

app.listen(port, () => {
    console.log('Serveur lancé sur le port: ', port);
});