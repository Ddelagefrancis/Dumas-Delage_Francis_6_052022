require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const path = require('path');

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

//  Connexion à la base de données
mongoose.connect(process.env.CONNECT_DB,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

// Sets "Cross-Origin-Resource-Policy: cross-origin" sécurise nos en-têtes HTPP
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// CORS Sécurise les en-têtes HTTP de notre app Express
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

// verification fonctionnement retour api sur port 3000
// app.use('/api/sauce', (req, res, next) => {
//     const sauce = [
//         {
//             _id: ("62992a3d165f88a55fbc"),
//             userId: 'qsomihvqios',
//             name: 'Ma premiere sauce',
//             manufacturer: 'sauce industrie',
//             description: 'Les infos de ma premiere sauce',
//             imageUrl: 'https://...',
//             heat: 8,
//             likes: 1,
//             dislikes: 2,
//         },
//         {
//             _id: ("62992a3d165f88a55fbc"),
//             userId: 'qsomihvqios',
//             name: 'Ma seconde sauce',
//             manufacturer: 'sauce industrie',
//             description: 'Les infos de ma seconde sauce',
//             imageUrl: 'https://...',
//             heat: 5,
//             likes: 3,
//             dislikes: 1,
//         },
//     ];
//     res.status(200).json(sauce);
// });

// Gestion des requêtes POST
app.use(express.json());

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(helmet());

// on recupere nos routes
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;