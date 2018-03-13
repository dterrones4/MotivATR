'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
    name: String,
});

const User = mongoose.model('User', userSchema, User);

module.exports = {User};
