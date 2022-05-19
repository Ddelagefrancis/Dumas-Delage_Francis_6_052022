const jwt = require('jsonwebtoken');

//  Vérifie le token en fonction du ID
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        
        //  Si le corps de la requête comporte un userId, on vérifie le userId correspond au token
        if (req.body.userId && req.body.userId !==userId) {
            throw 'User ID non valable !';
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée !'});
    }
};