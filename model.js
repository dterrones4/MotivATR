'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const User = mongoose.model('User', userSchema, User);

module.exports = {User};
