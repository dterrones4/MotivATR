'use strict';

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = require('./config').secret;
mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true, lowercase: true, required: [true, "can't be blank"], match: [/^[a-zA-ZA0-9]+$/, 'is invalid'], index: true},
    email: {type: String, unique: true, lowercase: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
    password: {type: String, require: true},
    //phoneNumber: {type: Number, unique: true, required: true},
    motivatrPhoneNumber: Number,
    fb_auth_token: String,
    fb_refresh_token: String,
    hash: String,
    salt: String
}, {timestamps: true});

userSchema.plugin(uniqueValidator, {message: 'is already taken.'});

userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10, 512, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 10, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

userSchema.methods.generateJWT = function() {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 30);

    return jwt.sign({
        id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000),
    }, secret);
};

userSchema.methods.serialize = function(){
    return {
        username: this.username,
        email: this.email,
        phoneNumber: this.phoneNumber,
        motivatrPhoneNumber: this.motivatrPhoneNumber,
        token: this.generateJWT()
    };
};

const UserAccount = mongoose.model('UserAccount', userSchema);

module.exports = {UserAccount};
