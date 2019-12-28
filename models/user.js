const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('../config/database')

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        // text: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }
});

const User = module.exports = mongoose.model('User', UserSchema);


User.generateToken = function (user) {
    return new Promise((resolve, reject) => {
        const token = jwt.sign(user, config.secret);
        resolve(token);
    });
}

User.encryptPassword = function (password) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(9, (err, salt) => {
            if (salt) {
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) return reject();
                    resolve({ salt, hash });
                });
            } else {
                reject();
            }
        });
    });
}

User.comparePassword = function (candidatePassword, password) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, password, (err, isMatch) => {
            resolve(isMatch);
        });
    });
}

User.findUserById = function (id) {
    return User.findById(id)
        .then((user) => {
            if (user) return user;
            Promise.reject('User not found.');
        });
}

User.findUserByEmail = function (email) {
    const query = { email: email }
    return User.findOne(query)
        .then((user) => {
            if (user) return Promise.reject('User already exists.');
        });
}


User.findUserByCredentials = function (email, password) {
    return User.findOne({ email })
        .then((user) => {
            if (!user) return Promise.reject('User not found.');
            if (!user.isActive) return Promise.reject('User is deactivated.');
            return User.comparePassword(password, user.password)
                .then(() => {
                    return user.token;
                });
        });
}


