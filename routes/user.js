const express = require('express');
const router = express.Router();

// importation middleware / password
const password = require("../middleware/password");

// importation controllers / user
const userCtrl = require('../controllers/user');

router.post('/signup', password, userCtrl.signup);
router.post('/login', userCtrl.login);


module.exports = router;