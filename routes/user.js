const express = require('express');
const router = express.Router();

// importation middleware / password
const password = require("../middleware/password");
const email = require("../middleware/email");
const connexion = require('../middleware/limit-connexion');

// importation controllers / user
const userCtrl = require('../controllers/user');

router.post('/signup', password, email, userCtrl.signup);
router.post('/login', connexion, userCtrl.login);


module.exports = router;