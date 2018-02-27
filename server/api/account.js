const logger = require('../log.js');
const bcrypt = require('bcrypt');
const passport = require('passport');
const config = require('../config.js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const util = require('../util.js');
const moment = require('moment');
const monk = require('monk');
const UserService = require('../services/UserService.js');
const _ = require('underscore');
const { wrapAsync } = require('../util.js');
const sendgrid = require('@sendgrid/mail');

let db = monk(config.dbPath);
let userService = new UserService(db);

if(config.emailKey) {
    sendgrid.setApiKey(config.emailKey);
}

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

function sendEmail(address, subject, email) {
    const message = {
        to: address,
        from: 'The Iron Throne <noreply@theironthrone.net>',
        subject: subject,
        text: email
    };

    return sendgrid.send(message).catch(err => {
        logger.error('Unable to send email', err);
    });
}

function validateUserName(username) {
    if(!username) {
        return 'You must specify a username';
    }

    if(username.length < 3 || username.length > 15) {
        return 'Username must be at least 3 characters and no more than 15 characters long';
    }

    if(!username.match(/^[A-Za-z0-9_-]+$/)) {
        return 'Usernames must only use the characters a-z, 0-9, _ and -';
    }

    return undefined;
}

function validateEmail(email) {
    if(!email) {
        return 'You must specify an email address';
    }

    if(!email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)) {
        return 'Please enter a valid email address';
    }

    return undefined;
}

function validatePassword(password) {
    if(!password) {
        return 'You must specify a password';
    }

    if(password.length < 6) {
        return 'Password must be at least 6 characters';
    }

    return undefined;
}

module.exports.init = function(server) {
    server.post('/api/account/register', wrapAsync(async (req, res, next) => {
        let message = validateUserName(req.body.username);
        if(message) {
            res.send({ success: false, message: message });

            return next();
        }

        message = validateEmail(req.body.email);
        if(message) {
            res.send({ success: false, message: message });
            return next();
        }

        message = validatePassword(req.body.password);
        if(message) {
            res.send({ success: false, message: message });
            return next();
        }

        let user = await userService.getUserByEmail(req.body.email);
        if(user) {
            res.send({ success: false, message: 'An account with that email already exists, please use another' });

            return next();
        }

        user = await userService.getUserByUsername(req.body.username);
        if(user) {
            res.send({ success: false, message: 'An account with that name already exists, please choose another' });

            return next();
        }

        let domain = req.body.email.substring(req.body.email.lastIndexOf('@') + 1);

        try {
            let response = await util.httpRequest(`http://check.block-disposable-email.com/easyapi/json/${config.emailBlockKey}/${domain}`);
            let answer = JSON.parse(response);

            if(answer.request_status !== 'success') {
                logger.warn('Failed to check email address', answer);
            }

            if(answer.domain_status === 'block') {
                logger.warn('Blocking', domain, 'from registering the account', req.body.username);
                res.send({ success: false, message: 'One time use email services are not permitted on this site.  Please use a real email address' });

                return next();
            }
        } catch(err) {
            logger.warn('Could not valid email address', domain, err);
        }

        let passwordHash = await hashPassword(req.body.password, 10);

        let expiration = moment().add(7, 'days');
        let formattedExpiration = expiration.format('YYYYMMDD-HH:mm:ss');
        let hmac = crypto.createHmac('sha512', config.hmacSecret);

        let activiationToken = hmac.update(`ACTIVATE ${req.body.username} ${formattedExpiration}`).digest('hex');

        let newUser = {
            password: passwordHash,
            registered: new Date(),
            username: req.body.username,
            email: req.body.email,
            emailHash: crypto.createHash('md5').update(req.body.email).digest('hex'),
            verified: false,
            activiationToken: activiationToken,
            activiationTokenExpiry: formattedExpiration,
            registerIp: req.get('x-real-ip')
        };

        user = await userService.addUser(newUser);
        let url = `https://theironthrone.net/activation?id=${user._id}&token=${activiationToken}`;
        let emailText = 'Hi,\n\nSomeone, hopefully you, has requested an account to be created on The Iron Throne (https://theironthrone.net).  If this was you, click this link ' + url + ' to complete the process.\n\n' +
            'If you did not request this please disregard this email.\n' +
            'Kind regards,\n\n' +
            'The Iron Throne team';

        await sendEmail(user.email, 'The Iron Throne - Account activation', emailText);

        res.send({ success: true });
    }));

    server.post('/api/account/activate', wrapAsync(async (req, res, next) => {
        if(!req.body.id || !req.body.token) {
            return res.send({ success: false, message: 'Invalid parameters' });
        }

        let user = await userService.getUserById(req.body.id);
        if(!user) {
            res.send({ success: false, message: 'An error occured activating your account, check the url you have entered and try again.' });

            return next();
        }

        if(!user.activiationToken) {
            logger.error('Got unexpected activate request for user', user.username);

            res.send({ success: false, message: 'An error occured activating your account, check the url you have entered and try again.' });

            return next();
        }

        let now = moment();
        if(user.activiationTokenExpiry < now) {
            res.send({ success: false, message: 'The activation token you have provided has expired.' });

            logger.error('Token expired', user.username);

            return next();
        }

        let hmac = crypto.createHmac('sha512', config.hmacSecret);
        let resetToken = hmac.update('ACTIVATE ' + user.username + ' ' + user.activiationTokenExpiry).digest('hex');

        if(resetToken !== req.body.token) {
            logger.error('Invalid activation token', user.username, req.body.token);

            res.send({ success: false, message: 'An error occured activating your account, check the url you have entered and try again.' });

            return next();
        }

        await userService.activateUser(user);

        res.send({ success: true });
    }));

    server.post('/api/account/check-username', function(req, res) {
        userService.getUserByUsername(req.body.username)
            .then(user => {
                if(user) {
                    return res.send({ success: true, message: 'An account with that name already exists, please choose another' });
                }

                return res.send({ success: true });
            })
            .catch(() => {
                return res.send({ success: false, message: 'Error occured looking up username' });
            });
    });

    server.post('/api/account/logout', function(req, res) {
        req.logout();

        res.send({ success: true });
    });

    server.post('/api/account/login', (req, res, next) => {
        if(!req.body.username) {
            res.send({ success: false, message: 'Username must be specified' });

            return next();
        }

        if(!req.body.password) {
            res.send({ success: false, message: 'Password must be specified' });

            return next();
        }

        passport.authenticate('local', (err, user) => {
            if(err) {
                return next(err);
            }

            if(!user) {
                return res.status(401).send({ success: false, message: 'Invalid username or password' });
            }

            if(!user.verified) {
                return res.send({ success: false, message: 'Your account is not verified, please click on the link we have emailed to you' });
            }

            req.logIn(user, err => {
                if(err) {
                    return next(err);
                }

                res.send({ success: true, user: req.user, token: jwt.sign(req.user, config.secret) });
            });
        })(req, res, next);
    });

    server.post('/api/account/password-reset-finish', wrapAsync(async (req, res, next) => {
        let resetUser;

        if(!req.body.id || !req.body.token || !req.body.newPassword) {
            return res.send({ success: false, message: 'Invalid parameters' });
        }

        let user = await userService.getUserById(req.body.id);
        if(!user) {
            res.send({ success: false, message: 'An error occured resetting your password, check the url you have entered and try again.' });

            return next();
        }

        if(!user.resetToken) {
            logger.error('Got unexpected reset request for user', user.username);

            res.send({ success: false, message: 'An error occured resetting your password, check the url you have entered and try again.' });

            return next();
        }

        let now = moment();
        if(user.tokenExpires < now) {
            res.send({ success: false, message: 'The reset token you have provided has expired.' });

            logger.error('Token expired', user.username);

            return next();
        }

        let hmac = crypto.createHmac('sha512', config.hmacSecret);
        let resetToken = hmac.update('RESET ' + user.username + ' ' + user.tokenExpires).digest('hex');

        if(resetToken !== req.body.token) {
            logger.error('Invalid reset token', user.username, req.body.token);

            res.send({ success: false, message: 'An error occured resetting your password, check the url you have entered and try again.' });

            return next();
        }

        resetUser = user;

        let passwordHash = await hashPassword(req.body.newPassword, 10);
        await userService.setPassword(resetUser, passwordHash);
        await userService.clearResetToken(resetUser);

        res.send({ success: true });
    }));

    server.post('/api/account/password-reset', wrapAsync(async (req, res) => {
        let emailUser;
        let resetToken;

        let response = await util.httpRequest(`https://www.google.com/recaptcha/api/siteverify?secret=${config.captchaKey}&response=${req.body.captcha}`);
        let answer = JSON.parse(response);

        if(!answer.success) {
            return res.send({ success: false, message: 'Please complete the captcha correctly' });
        }

        res.send({ success: true });

        let user = await userService.getUserByUsername(req.body.username);
        if(!user) {
            logger.error('Username not found for password reset', req.body.username);

            return;
        }

        let expiration = moment().add(4, 'hours');
        let formattedExpiration = expiration.format('YYYYMMDD-HH:mm:ss');
        let hmac = crypto.createHmac('sha512', config.hmacSecret);

        resetToken = hmac.update(`RESET ${user.username} ${formattedExpiration}`).digest('hex');
        emailUser = user;

        await userService.setResetToken(user, resetToken, formattedExpiration);
        let url = `https://theironthrone.net/reset-password?id=${emailUser._id}&token=${resetToken}`;
        let emailText = 'Hi,\n\nSomeone, hopefully you, has requested their password on The Iron Throne (https://theironthrone.net) to be reset.  If this was you, click this link ' + url + ' to complete the process.\n\n' +
            'If you did not request this reset, do not worry, your account has not been affected and your password has not been changed, just ignore this email.\n' +
            'Kind regards,\n\n' +
            'The Iron Throne team';

        await sendEmail(emailUser.email, 'The Iron Throne - Password reset', emailText);
    }));

    function updateUserData(user) {
        return {
            user: {
                username: user.username,
                email: user.email,
                emailHash: user.emailHash,
                _id: user._id,
                admin: user.admin,
                settings: user.settings,
                promptedActionWindows: user.promptedActionWindows,
                permissions: user.permissions || {}
            },
            token: jwt.sign(user, config.secret)
        };
    }

    function updateUser(res, user) {
        return userService.update(user)
            .then(() => {
                res.send(Object.assign({ success: true }, updateUserData(user)));
            })
            .catch(() => {
                return res.send({ success: false, message: 'An error occured updating your user profile' });
            });
    }

    server.put('/api/account/:username', (req, res) => {
        let userToSet = JSON.parse(req.body.data);
        let existingUser;

        if(!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        if(req.user.username !== req.params.username) {
            return res.status(403).send({ message: 'Unauthorized' });
        }

        userService.getUserByUsername(req.params.username)
            .then(user => {
                if(!user) {
                    return res.status(404).send({ message: 'Not found' });
                }

                user.email = userToSet.email;
                user.settings = userToSet.settings;
                user.promptedActionWindows = userToSet.promptedActionWindows;

                existingUser = user;

                if(userToSet.password && userToSet.password !== '') {
                    return hashPassword(userToSet.password, 10);
                }

                return updateUser(res, user);
            })
            .then(passwordHash => {
                if(!passwordHash) {
                    return;
                }

                existingUser.password = passwordHash;

                return updateUser(res, existingUser);
            })
            .catch(() => {
                return res.send({ success: false, message: 'An error occured updating your user profile' });
            });
    });

    server.get('/api/account/:username/blocklist', wrapAsync(async (req, res) => {
        let user = await checkAuth(req, res);

        if(!user) {
            return;
        }

        let blockList = user.blockList || [];
        res.send({ success: true, blockList: blockList.sort() });
    }));

    server.post('/api/account/:username/blocklist', wrapAsync(async (req, res) => {
        let user = await checkAuth(req, res);

        if(!user) {
            return;
        }

        if(!user.blockList) {
            user.blockList = [];
        }

        if(_.find(user.blockList, user => {
            return user === req.body.username.toLowerCase();
        })) {
            return res.send({ success: false, message: 'Entry already on block list' });
        }

        user.blockList.push(req.body.username.toLowerCase());

        await userService.updateBlockList(user);

        res.send(Object.assign(
            { success: true, message: 'Block list entry added successfully', username: req.body.username.toLowerCase() },
            updateUserData(user)
        ));
    }));

    server.delete('/api/account/:username/blocklist/:entry', wrapAsync(async (req, res) => {
        let user = await checkAuth(req, res);

        if(!user) {
            return;
        }

        if(!req.params.entry) {
            return res.send({ success: false, message: 'Parameter "entry" is required' });
        }

        if(!user.blockList) {
            user.blockList = [];
        }

        if(!_.find(user.blockList, user => {
            return user === req.params.entry.toLowerCase();
        })) {
            return res.status(404).send({ message: 'Not found' });
        }

        user.blockList = _.reject(user.blockList, user => {
            return user === req.params.entry.toLowerCase();
        });

        await userService.updateBlockList(user);

        res.send(Object.assign(
            { success: true, message: 'Block list entry removed successfully', username: req.params.entry.toLowerCase() },
            updateUserData(user)
        ));
    }));
};

async function checkAuth(req, res) {
    let user = await userService.getUserByUsername(req.params.username);

    if(!req.user) {
        res.status(401).send({ message: 'Unauthorized' });

        return null;
    }

    if(req.user.username !== req.params.username) {
        res.status(403).send({ message: 'Unauthorized' });

        return null;
    }

    if(!user) {
        res.status(404).send({ message: 'Not found' });

        return null;
    }

    return user;
}
