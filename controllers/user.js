const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//  Nouveau utilisateur
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash,
        });
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

//  Utilisateur existant
exports.login = (req, res, next) => { 
    console.log('contenue du body ' + req.body);
    //  Trouver un utilisateur avec l'email
    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            console.log('echec de connection');
            return res.status(401).json({ error: 'Utilisateur non trouvé !'});
        }
        //  Compare le mdp envoyé avec la requête et le hash
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect !'});
            }
            //  Connection réussie, id de l'utilisateur + token de connexion valide
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userId: user._id },
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: '24h' }
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};