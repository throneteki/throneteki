const logger = require('./../log.js');
const bcrypt = require('bcrypt');
const passport = require('passport');
const config = require('./../config.js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const util = require('../util.js');
const nodemailer = require('nodemailer');
const hmac = crypto.createHmac('sha512', config.hmacSecret);
const moment = require('moment');
const UserRepository = require('../repositories/userRepository.js');

var userRepository = new UserRepository();

function hashPassword(password, rounds) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, rounds, function(err, hash) {
            if(err) {
                return reject(err);
            }

            return resolve(hash);
        });
    });
}

module.exports.init = function(server) {
    server.post('/api/account/register', function(req, res, next) {
        userRepository.getUserByUsername(req.body.username).then(user => {
            if(user) {
                res.send({ success: false, message: 'An account with that name already exists, please choose another' });
                return next();
            }

            return hashPassword(req.body.password, 10);
        }).then(hash => {
            req.body.password = hash;
            req.body.registered = new Date();
            req.body.emailHash = crypto.createHash('md5').update(req.body.email).digest('hex');

            return userRepository.addUser(req.body);
        }).then(() => {
            return new Promise((resolve, reject) => {
                req.login(req.body, function(err) {
                    if(err) {
                        return reject(err);
                    }

                    resolve();
                });
            });
        }).then(() => {
            res.send({ success: true, user: req.body, token: jwt.sign(req.user, config.secret)});
        }).catch(err => {
            res.send({ success: false, message: 'An error occured registering your account' });
            logger.info(err.message);
            return next(err);
        });
    });

    server.post('/api/account/check-username', function(req, res) {
        userRepository.getUserByUsername(req.body.username).then(user => {
            logger.info(user);

            if(user) {
                res.send({ message: 'An account with that name already exists, please choose another' });
                return;
            }

            res.send({ message: '' });
        }).catch(err => {
            logger.info(err);
            res.send({ message: '' });
            logger.info(err.message);
        });
    });

    server.post('/api/account/logout', function(req, res) {
        req.logout();

        res.send({ success: true});
    });

    server.post('/api/account/login', passport.authenticate('local'), function(req, res) {
        res.send({ success: true, user: req.user, token: jwt.sign(req.user, config.secret) });
    });

    server.post('/api/account/password-reset', function(req, res) {
        util.httpRequest('https://www.google.com/recaptcha/api/siteverify?secret=' + config.captchaKey + '&response=' + req.body.captcha)
        .then((response) => {
            var answer = JSON.parse(response);

            if(!answer.success) {
                return res.send({ success: false, message: 'Please complete the captcha correctly' });
            }

            res.send({ success: true });

            return userRepository.getUserByUsername(req.body.username);
        })
        .then(user => {
            if(!user) {
                return;
            }

            var expiration = moment();

            var resetToken = hmac.update('RESET ' + user.username + ' ' + expiration).digest('hex');

            var emailTransport = nodemailer.createTransport(config.emailPath);

            emailTransport.sendMail({
                from: 'The Iron Throne <noreply@theironthrone.net',
                to: user.email,
                subject: 'Your account at The Iron Throne',
                text: 'Hi, Someone, hopefully you, has requested their password on The Iron Throne (https://theironthronet.net).  If this was you, click this link <link> to complete the process.  If you did not request this reset, do not worry, your account has not been changed, just ignore this email.'
            });            
        })
        .catch(err => {
            logger.info(err.message);
            res.send({ success: false, message: 'There was a problem verifying the captcha, please try again' });
        });
    });
};
