const express = require('express');
const router = express.Router();

// importation middleware / password
const password = require("../middleware/password");

const connexion = require('../middleware/limit-connexion');

// importation controllers / user
const userCtrl = require('../controllers/user');

router.post('/signup', password, userCtrl.signup);
router.post('/login', connexion, userCtrl.login);


module.exports = router;