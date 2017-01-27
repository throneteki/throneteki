const logger = require('./../log.js');
const bcrypt = require('bcrypt');
const passport = require('passport');
const config = require('./../config.js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const util = require('../util.js');
const nodemailer = require('nodemailer');
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

function loginUser(request, user) {
    return new Promise((resolve, reject) => {
        request.login(user, function(err) {
            if(err) {
                return reject(err);
            }
            
            resolve();
        });
    });    
}

function sendEmail(address, email) {
    return new Promise((resolve, reject) => {
        var emailTransport = nodemailer.createTransport(config.emailPath);

        emailTransport.sendMail({
            from: 'The Iron Throne <noreply@theironthrone.net',
            to: address,
            subject: 'Your account at The Iron Throne',
            text: email
        }, function(error) {
            if(error) {
                reject(error);
            }

            resolve();
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
            return loginUser(req, req.body);
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
        var resetToken = '';
        var responseSent = false;
        var emailUser;

        util.httpRequest('https://www.google.com/recaptcha/api/siteverify?secret=' + config.captchaKey + '&response=' + req.body.captcha).then((response) => {
            var answer = JSON.parse(response);

            if(!answer.success) {
                return res.send({ success: false, message: 'Please complete the captcha correctly' });
            }

            res.send({ success: true });

            responseSent = true;

            return userRepository.getUserByUsername(req.body.username);
        }).then(user => {
            if(!user) {
                throw new Error('username not found for password reset ' + req.body.username);
            }

            emailUser = user;

            var expiration = moment().add(4, 'hours');
            var formattedExpiration = expiration.format('YYYYMMDD-HH:mm:ss');
            var hmac = crypto.createHmac('sha512', config.hmacSecret);

            resetToken = hmac.update('RESET ' + user.username + ' ' + formattedExpiration).digest('hex');

            return userRepository.setResetToken(user, resetToken, formattedExpiration);
        }).then(() => {
            var url = 'https://theironthrone.net/reset-password?id=' + emailUser._id + '&token=' + resetToken;

            var emailText = 'Hi,\n\nSomeone, hopefully you, has requested their password on The Iron Throne (https://theironthronet.net) to be reset.  If this was you, click this link ' + url + ' to complete the process.\n\n' +
                  'If you did not request this reset, do not worry, your account has not been affected and your password has not been changed, just ignore this email.\n' +
                  'Kind regards,\n\n' +
                  'The Iron Throne team';
                  
            sendEmail(emailUser.email, emailText);
        })
        .catch(err => {
            logger.info(err.message);
            if(!responseSent) {
                res.send({ success: false, message: 'There was a problem verifying the captcha, please try again' });
            }
        });
    });
};
