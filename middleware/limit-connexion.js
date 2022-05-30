const expressLimit = require("express-rate-limit");

// Limitation des connexions
const maximumAttempts = expressLimit({
    // délai en millisecondes
    windowMs: 3 * 60 * 1000,
    // Limite chaque IP à 3 demandes de tentatives de connexions
    max: 3,
    message:
       "Votre compte est bloqué pendant 3 minutes suite aux tentatives de connexions échouées !",
});

module.exports = maximumAttempts;