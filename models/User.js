const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator , { message: '{PATH} cet E-mail existe déjà!' });

// on export le model avec le nom User
module.exports = mongoose.model('User', userSchema);