const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');


const app = express();
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

//Connexion à la Base de données MongoDB
mongoose.connect("mongodb+srv://nicolas:roxane@cluster0.ohv4e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//Gestion des erreurs CORS
app.use((req, res, next) => { // Le middleware ne prend pas d'adresse en premier paramètre afin de s'appliquer à toutes les routes
    res.setHeader('Access-Control-Allow-Origin', '*'); // '*' permet d'accéder à notre API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); // ajouter les headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // envoie des requêtes avec les méthodes mentionnées
    next();
})

//Routes utilisateurs
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;