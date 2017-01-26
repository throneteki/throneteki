const logger = require('./../log.js');
const bcrypt = require('bcrypt');
const passport = require('passport');
const config = require('./../config.js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const escapeRegex = require('../util.js').escapeRegex;
const https = require('https');
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
        var responseStr = '';
        var url = 'https://www.google.com/recaptcha/api/siteverify?secret=' + config.captchaKey + '&response=' + req.body.captcha;

        https.get(url, function(response) {
            response.on('data', function(chunk) {
                responseStr += chunk;                    
            });

            response.on('end', function() {
                var answer = JSON.parse(responseStr);

                if(!answer.success) {
                    return res.send({ success: false, message: 'Please complete the captcha correctly' });
                }

                res.send({ success: true });

                db.collection('users').findOne({ username: {'$regex': new RegExp('^' + escapeRegex(req.body.username.toLowerCase()), 'i')}}, function(err, account) {
                    if(!err && account) {
                        var expiration = moment();

                        hmac.on('readable', () => {
                            var resetToken = hmac.read();
                            if(!resetToken) {
                                return;
                            }

                            console.info(resetToken.toString('hex'));

                            // db.collection('tokens').insert({
                            //     username: req.body.username,
                            //     expiration: expiration,
                            //     token: 
                            // }, function(err) {

                            // });

                            var emailTransport = nodemailer.createTransport(config.emailPath);

                            emailTransport.sendMail({
                                from: 'The Iron Throne <noreply@theironthrone.net',
                                to: account.email,
                                subject: 'Your account at The Iron Throne',
                                text: 'Hi, Someone, hopefully you, has requested their password on The Iron Throne (https://theironthronet.net).  If this was you, click this link <link> to complete the process.  If you did not request this reset, do not worry, your account has not been changed, just ignore this email.'
                            });

                        });

                        hmac.write('RESET ' + account.username + ' ' + expiration);
                        hmac.end();                        
                    }
                });
            });
        }).on('error', function(e) {
            logger.info(e.message);
            res.send({ success: false, message: 'There was a problem verifying the captcha, please try again' });
        });
    });
};
