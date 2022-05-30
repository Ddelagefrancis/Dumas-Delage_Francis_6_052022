const passwordValidator = require("password-validator");

// Création du schéma
const passwordSchema = new passwordValidator();

// Ajout des propriétés au shéma
passwordSchema
    .is()
    // Longueur minimal 8
    .min(8)
    .is()
    // Longueur maximal 10
    .max(10)
    .has()
    // Doit contenir 1 lettres majuscules
    .uppercase(1)
    .has()
    // Doit contenir des lettres minuscules
    .lowercase()
    .has()
    // Doit avoir au moins 2 chiffres
    .digits(2)
    .has()
    .not()
    // Ne doit pas avoir d'espaces
    .spaces()
    .is()
    .not()
    // Liste noire
    .oneOf(["Passw0rd", "Password123"]);

// Vérification du mot de passe
module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        return res.status(400).json({ message: "Le mot de passe doit contenir entre 8 et 10 caractères, avec au moins une majuscule et deux chiffres !" });
    } else {
        next();
    }
};