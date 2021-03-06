require('dotenv').config();
const jwt = require('jsonwebtoken');

//  Vérifie le token en fonction du ID
module.exports = (req, res, next) => {
    try {
        // Retourne un tableau, vérifie le TOKEN, récupère l'userID
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
        const userId = decodedToken.userId;
        req.auth = { userId };

        //  Si le corps de la requête comporte un userId, on vérifie que le userId correspond au token
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !';
        } else {
            next();
        }
    } catch {
        res.status(401).json({ error: new error ('Requête non authentifiée !')
    });
    }
};