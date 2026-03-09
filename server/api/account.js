import bcrypt from 'bcrypt';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import moment from 'moment';
import _ from 'underscore';
import logger from '../log.js';
import { wrapAsync } from '../util.js';
import { writeFile } from 'fs/promises';
import ServiceFactory from '../services/ServiceFactory.js';
const configService = ServiceFactory.configService();
const appName = configService.getValue('appName');

let userService;
let abuseService;
let disposableEmailService;
let ipQualityScoreService;
let proxyCheckService;
let emailService;
const ActivationTokenLifetimeDays = 7;
const ResetTokenLifetimeHours = 4;

function mergeExternalRisk(...risks) {
    return risks.reduce(
        (mergedRisk, risk) => {
            if (!risk) {
                return mergedRisk;
            }

            return {
                denyRegistration: mergedRisk.denyRegistration || !!risk.denyRegistration,
                riskFlags: [...new Set(mergedRisk.riskFlags.concat(risk.riskFlags || []))],
                riskScoreDelta: mergedRisk.riskScoreDelta + (risk.riskScoreDelta || 0),
                findings: {
                    ...mergedRisk.findings,
                    ...(risk.findings || {})
                }
            };
        },
        {
            denyRegistration: false,
            riskFlags: [],
            riskScoreDelta: 0,
            findings: {}
        }
    );
}

function hashPassword(password, rounds) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, rounds, function (err, hash) {
            if (err) {
                return reject(err);
            }

            return resolve(hash);
        });
    });
}

function hashActivationToken(token) {
    return crypto
        .createHmac('sha256', configService.getValue('hmacSecret'))
        .update(token)
        .digest('hex');
}

function createActivationToken() {
    let token = crypto.randomBytes(32).toString('hex');

    return {
        token,
        tokenHash: hashActivationToken(token),
        expiresAt: moment().add(ActivationTokenLifetimeDays, 'days').toDate()
    };
}

function createResetToken() {
    let token = crypto.randomBytes(32).toString('hex');

    return {
        token,
        tokenHash: hashActivationToken(token),
        expiresAt: moment().add(ResetTokenLifetimeHours, 'hours').toDate()
    };
}

function getActivationExpiryDate(user) {
    if (!user?.activationTokenExpiry) {
        return undefined;
    }

    let parsedExpiry = moment(
        user.activationTokenExpiry,
        [moment.ISO_8601, 'YYYYMMDD-HH:mm:ss'],
        true
    );

    if (!parsedExpiry.isValid()) {
        return undefined;
    }

    return parsedExpiry.toDate();
}

function getLegacyActivationToken(user) {
    if (!user?.activationTokenExpiry) {
        return undefined;
    }

    let expiry = user.activationTokenExpiry;
    if (expiry instanceof Date) {
        expiry = moment(expiry).format('YYYYMMDD-HH:mm:ss');
    }

    return crypto
        .createHmac('sha512', configService.getValue('hmacSecret'))
        .update(`ACTIVATE ${user.username} ${expiry}`)
        .digest('hex');
}

function getResetExpiryDate(user) {
    if (!user?.tokenExpires) {
        return undefined;
    }

    let parsedExpiry = moment(user.tokenExpires, [moment.ISO_8601, 'YYYYMMDD-HH:mm:ss'], true);

    if (!parsedExpiry.isValid()) {
        return undefined;
    }

    return parsedExpiry.toDate();
}

function getLegacyResetToken(user) {
    if (!user?.tokenExpires) {
        return undefined;
    }

    let expiry = user.tokenExpires;
    if (expiry instanceof Date) {
        expiry = moment(expiry).format('YYYYMMDD-HH:mm:ss');
    }

    return crypto
        .createHmac('sha512', configService.getValue('hmacSecret'))
        .update(`RESET ${user.username} ${expiry}`)
        .digest('hex');
}

function tokensMatch(left, right) {
    if (!left || !right) {
        return false;
    }

    let leftBuffer = Buffer.from(left);
    let rightBuffer = Buffer.from(right);

    if (leftBuffer.length !== rightBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function shouldExposeActivationToken() {
    return configService.getValue('env') !== 'production';
}

function validateUserName(username) {
    if (!username) {
        return 'You must specify a username';
    }

    if (username.length < 3 || username.length > 15) {
        return 'Username must be at least 3 characters and no more than 15 characters long';
    }

    if (!username.match(/^[A-Za-z0-9_-]+$/)) {
        return 'Usernames must only use the characters a-z, 0-9, _ and -';
    }

    return undefined;
}

function validateEmail(email) {
    if (!email) {
        return 'You must specify an email address';
    }

    if (
        !email.match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
        return 'Please enter a valid email address';
    }

    return undefined;
}

function validatePassword(password) {
    if (!password) {
        return 'You must specify a password';
    }

    if (password.length < 6) {
        return 'Password must be at least 6 characters';
    }

    return undefined;
}

const DefaultEmailHash = crypto.createHash('md5').update('noreply@theironthrone.net').digest('hex');

function getRequestIp(req) {
    let ip = req.ip || req.get('x-real-ip') || req.headers['x-forwarded-for'];

    if (Array.isArray(ip)) {
        [ip] = ip;
    }

    if (typeof ip === 'string') {
        [ip] = ip.split(',');
        ip = ip.trim();
    }

    return ip || req.socket?.remoteAddress || req.connection?.remoteAddress;
}

function getSignupFingerprint(req) {
    return {
        userAgent: req.headers['user-agent'],
        language: req.headers['accept-language'],
        timezone: req.body.timezone,
        platform: req.body.platform,
        fingerprint: req.body.fingerprint
    };
}

async function verifyCaptchaToken(captcha) {
    const captchaKey = configService.getValue('captchaKey');

    if (!captchaKey) {
        logger.warn('Captcha verification requested but captchaKey is not configured');
        return {
            success: false,
            message: 'Captcha verification is temporarily unavailable. Please try again later.'
        };
    }

    if (!captcha) {
        return {
            success: false,
            message: 'Please complete the captcha correctly'
        };
    }

    const params = new URLSearchParams();
    params.append('secret', captchaKey);
    params.append('response', captcha);

    let response = await fetch('https://api.hcaptcha.com/siteverify', {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: params
    });

    let answer = await response.json();

    if (!answer.success) {
        logger.warn('Failed captcha %s', answer);
        return {
            success: false,
            message: 'Please complete the captcha correctly'
        };
    }

    return { success: true };
}

export const init = function (server, options) {
    userService = ServiceFactory.userService(options.db, configService);
    let banlistService = ServiceFactory.banlistService(options.db);
    abuseService = ServiceFactory.abuseService(options.db, configService);
    disposableEmailService = ServiceFactory.disposableEmailService(configService);
    ipQualityScoreService = ServiceFactory.ipQualityScoreService(configService);
    proxyCheckService = ServiceFactory.proxyCheckService(configService);
    emailService = ServiceFactory.emailService(configService);
    let patreonService = ServiceFactory.patreonService(
        configService.getValue('patreonClientId'),
        configService.getValue('patreonSecret'),
        userService,
        configService.getValue('patreonCallbackUrl')
    );

    server.post(
        '/api/account/preflight-register',
        wrapAsync(async (req, res) => {
            let message = validateEmail(req.body.email);
            if (message) {
                return res.status(400).send({ success: false, message });
            }

            let ip = getRequestIp(req);
            let externalRisk = mergeExternalRisk(
                await ipQualityScoreService.assessRegistration({
                    email: req.body.email
                }),
                await proxyCheckService.assessRegistration({
                    ip
                })
            );

            const assessment = await abuseService.assessRegistrationAttempt({
                ip,
                email: req.body.email,
                username: req.body.username,
                fingerprint: getSignupFingerprint(req),
                externalRisk
            });

            const canProceed = !assessment.blocked && assessment.cooldownRemainingMs <= 0;
            const response = {
                canProceed,
                challengeRequired: assessment.challengeRequired,
                cooldownRemainingMs: assessment.cooldownRemainingMs,
                trustState: assessment.trustState,
                restrictedUntil: assessment.restrictedUntil,
                reviewMessage:
                    assessment.trustState === 'restricted'
                        ? 'This account will have limited permissions until it has established trust.'
                        : undefined
            };

            await abuseService.logEvent({
                type: 'registration_attempt',
                username: req.body.username,
                ip: assessment.ip,
                subnet: assessment.subnet,
                fingerprintHash: assessment.fingerprintHash,
                emailDomain: assessment.emailDomain,
                outcome: canProceed
                    ? assessment.trustState === 'restricted'
                        ? 'restricted'
                        : assessment.challengeRequired
                          ? 'challenged'
                          : 'allowed'
                    : 'blocked',
                signals: [
                    `ip:${assessment.ip}`,
                    assessment.subnet ? `subnet:${assessment.subnet}` : undefined,
                    ...assessment.riskFlags
                ].filter(Boolean),
                scoreDelta: assessment.riskScore
            });

            if (!canProceed) {
                const status = assessment.cooldownRemainingMs > 0 ? 429 : 403;
                return res.status(status).send({
                    success: false,
                    message:
                        assessment.cooldownRemainingMs > 0
                            ? 'Too many recent registration attempts. Please try again later.'
                            : 'We could not complete this registration request. Please contact support if you believe this is an error.',
                    data: response
                });
            }

            if (assessment.challengeRequired && req.body.captcha) {
                const captchaResult = await verifyCaptchaToken(req.body.captcha);
                if (!captchaResult.success) {
                    return res.status(400).send({
                        success: false,
                        message: captchaResult.message
                    });
                }
            }

            return res.send({ success: true, data: response });
        })
    );

    server.post(
        '/api/account/register',
        wrapAsync(async (req, res) => {
            let message = validateUserName(req.body.username);
            if (message) {
                return res.status(400).send({ success: false, message: message });
            }

            message = validateEmail(req.body.email);
            if (message) {
                return res.status(400).send({ success: false, message: message });
            }

            message = validatePassword(req.body.password);
            if (message) {
                return res.status(400).send({ success: false, message: message });
            }

            await userService.deleteExpiredUnverifiedAccounts({
                email: req.body.email,
                username: req.body.username
            });

            let user = await userService.getUserByEmail(req.body.email);
            if (user) {
                return res.status(400).send({
                    success: false,
                    message: 'An account with that email already exists, please use another'
                });
            }

            user = await userService.getUserByUsername(req.body.username);
            if (user) {
                return res.status(400).send({
                    success: false,
                    message: 'An account with that name already exists, please choose another'
                });
            }

            let emailRisk = await disposableEmailService.evaluateRegistrationEmail(req.body.email);
            if (emailRisk.verdict === 'deny') {
                logger.warn(
                    'Blocking %s from registering the account %s due to %s',
                    emailRisk.domain,
                    req.body.username,
                    emailRisk.source
                );
                return res.status(400).send({
                    success: false,
                    message:
                        'One time use email services are not permitted on this site.  Please use a real email address'
                });
            }

            let requireActivation = configService.getValue('requireActivation');
            let passwordHash = await hashPassword(req.body.password, 10);
            let ip = getRequestIp(req);
            let externalRisk = mergeExternalRisk(
                await ipQualityScoreService.assessRegistration({
                    email: req.body.email
                }),
                await proxyCheckService.assessRegistration({
                    ip
                })
            );

            if (externalRisk.denyRegistration) {
                logger.warn(
                    'Blocking %s from registering the account %s due to ipqs',
                    req.body.email,
                    req.body.username
                );
                return res.status(400).send({
                    success: false,
                    message:
                        'One time use email services are not permitted on this site.  Please use a real email address'
                });
            }

            const assessment = await abuseService.assessRegistrationAttempt({
                ip,
                email: req.body.email,
                username: req.body.username,
                fingerprint: getSignupFingerprint(req),
                externalRisk
            });

            await abuseService.logEvent({
                type: 'registration_attempt',
                username: req.body.username,
                ip: assessment.ip,
                subnet: assessment.subnet,
                fingerprintHash: assessment.fingerprintHash,
                emailDomain: assessment.emailDomain,
                outcome:
                    assessment.cooldownRemainingMs > 0
                        ? 'blocked'
                        : assessment.blocked
                          ? 'blocked'
                          : assessment.trustState === 'restricted'
                            ? 'restricted'
                            : assessment.challengeRequired
                              ? 'challenged'
                              : 'allowed',
                signals: [
                    `ip:${assessment.ip}`,
                    assessment.subnet ? `subnet:${assessment.subnet}` : undefined,
                    ...assessment.riskFlags
                ].filter(Boolean),
                scoreDelta: assessment.riskScore
            });

            if (assessment.cooldownRemainingMs > 0) {
                return res.status(429).send({
                    success: false,
                    message: 'Too many recent registration attempts. Please try again later.'
                });
            }

            if (assessment.blocked) {
                return res.status(403).send({
                    success: false,
                    message:
                        'We could not complete this registration request. Please contact support if you believe this is an error.'
                });
            }

            if (assessment.challengeRequired) {
                const captchaResult = await verifyCaptchaToken(req.body.captcha);
                if (!captchaResult.success) {
                    return res.status(400).send({
                        success: false,
                        message: captchaResult.message
                    });
                }
            }

            let activationTokenValue;
            let newUser = {
                password: passwordHash,
                registered: new Date(),
                username: req.body.username,
                email: req.body.email,
                emailDomain: assessment.emailDomain,
                enableGravatar: req.body.enableGravatar,
                verified: !requireActivation,
                registerIp: ip,
                registerIpNormalized: assessment.ip,
                registerSubnet: assessment.subnet,
                lastLoginIp: assessment.ip,
                lastLoginSubnet: assessment.subnet,
                signupFingerprintHash: assessment.fingerprintHash,
                riskFlags: assessment.riskFlags,
                riskScore: assessment.riskScore,
                trustState: assessment.trustState,
                restrictedUntil: assessment.restrictedUntil,
                evasionReviewRequired: assessment.trustState === 'restricted'
            };
            if (requireActivation) {
                let activationToken = createActivationToken();
                newUser.activationTokenHash = activationToken.tokenHash;
                newUser.activationTokenExpiry = activationToken.expiresAt;
                newUser.activationTokenVersion = 2;
                newUser.activationTokenIssuedAt = new Date();
                newUser.activationToken = undefined;
                activationTokenValue = activationToken.token;
            }

            try {
                let lookup = await banlistService.getEntryByIp(ip);
                if (lookup) {
                    return res.status(400).send({
                        success: false,
                        message:
                            'An error occurred registering your account, please try again later.'
                    });
                }
            } catch (err) {
                logger.error(err);

                return res.status(400).send({
                    success: false,
                    message: 'An error occurred registering your account, please try again later.'
                });
            }

            user = await userService.addUser(newUser);
            if (requireActivation) {
                let url = `${req.protocol}://${req.get('host')}/activation?id=${user._id}&token=${activationTokenValue}`;
                let emailText =
                    `Hi,\n\nSomeone, hopefully you, has requested an account to be created on ${appName} (${req.protocol}://${req.get('host')}).  If this was you, click this link ${url} to complete the process.\n\n` +
                    'If you did not request this please disregard this email.\n' +
                    'Kind regards,\n\n' +
                    `${appName} team`;

                await emailService.sendEmail(
                    user.email,
                    `${appName} - Account activation`,
                    emailText
                );
            }

            res.send({
                success: true,
                data: {
                    requiresVerification: requireActivation,
                    activationToken:
                        requireActivation && shouldExposeActivationToken()
                            ? activationTokenValue
                            : undefined,
                    trustState: newUser.trustState,
                    restrictedUntil: newUser.restrictedUntil,
                    reviewMessage:
                        newUser.trustState === 'restricted'
                            ? 'Your account was created with limited permissions while it is reviewed.'
                            : undefined
                }
            });

            await downloadAvatar(user);
        })
    );

    server.post(
        '/api/account/activate',
        wrapAsync(async (req, res) => {
            if (!req.body.id || !req.body.token) {
                return res.status(400).send({ success: false, message: 'Invalid parameters' });
            }

            if (!req.body.id.match(/^[a-f\d]{24}$/i)) {
                return res.send({ success: false, message: 'Invalid parameters' });
            }

            let user = await userService.getUserById(req.body.id);
            if (!user) {
                return res.send({
                    success: false,
                    message:
                        'An error occured activating your account, check the url you have entered and try again.'
                });
            }

            if (!user.activationToken && !user.activationTokenHash) {
                logger.error('Got unexpected activate request for user %s', user.username);

                return res.send({
                    success: false,
                    message:
                        'An error occured activating your account, check the url you have entered and try again.'
                });
            }

            let activationExpiry = getActivationExpiryDate(user);
            if (!activationExpiry || activationExpiry.getTime() <= Date.now()) {
                logger.error('Token expired %s', user.username);

                return res.send({
                    success: false,
                    message: 'The activation token you have provided has expired.'
                });
            }

            let hashedToken = hashActivationToken(req.body.token);
            let expectedToken =
                user.activationTokenHash ||
                (user.activationToken ? getLegacyActivationToken(user) : undefined);
            let providedToken = user.activationTokenHash ? hashedToken : req.body.token;

            if (!tokensMatch(expectedToken, providedToken)) {
                logger.error('Invalid activation token', user.username, req.body.token);

                return res.send({
                    success: false,
                    message:
                        'An error occured activating your account, check the url you have entered and try again.'
                });
            }

            await userService.activateUser(user);

            res.send({ success: true });
        })
    );

    server.post(
        '/api/account/check-username',
        wrapAsync(async (req, res) => {
            let user = await userService.getUserByUsername(req.body.username);
            if (user) {
                return res.status(400).send({
                    success: false,
                    data: 'An account with that name already exists, please choose another'
                });
            }

            return res.send({ success: true });
        })
    );

    server.post(
        '/api/account/logout',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async (req, res) => {
            if (!req.body.tokenId) {
                return res.send({ success: false, message: 'tokenId is required' });
            }

            let session = await userService.getRefreshTokenById(
                req.user.username,
                req.body.tokenId
            );
            if (!session) {
                return res.send({ success: false, message: 'Error occured logging out' });
            }

            await userService.removeRefreshToken(req.user.username, req.body.tokenId);

            res.send({ success: true });
        })
    );

    server.post(
        '/api/account/checkauth',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async (req, res) => {
            let user = await userService.getUserByUsername(req.user.username);
            let userDetails = user.getWireSafeDetails();

            if (!user.patreon || !user.patreon.refresh_token) {
                return res.send({ success: true, data: userDetails });
            }

            userDetails.patreon = await patreonService.getPatreonStatusForUser(user);

            if (userDetails.patreon === 'none') {
                delete userDetails.patreon;

                let ret = await patreonService.refreshTokenForUser(user);
                if (!ret) {
                    return res.send({ success: true, data: userDetails });
                }

                userDetails.patreon = await patreonService.getPatreonStatusForUser(user);

                if (userDetails.patreon === 'none') {
                    return res.send({ success: true, data: userDetails });
                }
            }

            if (userDetails.patreon === 'pledged' && !userDetails.permissions.isSupporter) {
                await userService.setSupporterStatus(user.username, true);
                // eslint-disable-next-line require-atomic-updates
                userDetails.permissions.isSupporter = req.user.permissions.isSupporter = true;
            } else if (userDetails.patreon !== 'pledged' && userDetails.permissions.isSupporter) {
                await userService.setSupporterStatus(user.username, false);
                // eslint-disable-next-line require-atomic-updates
                userDetails.permissions.isSupporter = req.user.permissions.isSupporter = false;
            }

            res.send({ success: true, data: userDetails });
        })
    );

    server.post(
        '/api/account/login',
        wrapAsync(async (req, res) => {
            if (!req.body.username) {
                return res.send({ success: false, message: 'Username must be specified' });
            }

            if (!req.body.password) {
                return res.send({ success: false, message: 'Password must be specified' });
            }

            let user = await userService.getUserByUsername(req.body.username);
            if (!user) {
                return res.send({ success: false, message: 'Invalid username/password' });
            }

            if (user.disabled) {
                return res.send({ success: false, message: 'Invalid username/password' });
            }

            let isValidPassword;
            try {
                isValidPassword = await bcrypt.compare(req.body.password, user.password);
            } catch (err) {
                logger.error(err);

                return res.send({
                    success: false,
                    message:
                        'There was an error validating your login details.  Please try again later'
                });
            }

            if (!isValidPassword) {
                return res.send({ success: false, message: 'Invalid username/password' });
            }

            if (!user.verified) {
                return res.send({
                    success: false,
                    message: 'You must verifiy your account before trying to log in'
                });
            }

            const loginAssessment = await abuseService.assessLoginAttempt(user, {
                ip: getRequestIp(req),
                fingerprint: getSignupFingerprint(req)
            });
            await abuseService.logEvent({
                type: 'login_attempt',
                username: user.username,
                userId: user._id,
                ip: loginAssessment.ip,
                subnet: loginAssessment.subnet,
                fingerprintHash: loginAssessment.fingerprintHash,
                emailDomain: user.emailDomain,
                outcome: loginAssessment.blocked ? 'blocked' : 'allowed',
                signals: loginAssessment.linkedUsers.flatMap((linkedUser) => linkedUser.evidence)
            });

            if (loginAssessment.blocked) {
                return res.send({ success: false, message: 'Invalid username/password' });
            }

            let userObj = user.getWireSafeDetails();

            let authToken = jwt.sign(userObj, configService.getValue('secret'), {
                expiresIn: '5m'
            });
            let ip = loginAssessment.ip;

            let refreshToken = await userService.addRefreshToken(user.username, authToken, ip);
            if (!refreshToken) {
                return res.send({
                    success: false,
                    message:
                        'There was an error validating your login details.  Please try again later'
                });
            }

            res.send({
                success: true,
                data: {
                    user: userObj,
                    token: authToken,
                    refreshToken: refreshToken
                }
            });

            await abuseService.updateUserSessionMetadata(user.username, {
                ip: loginAssessment.ip,
                subnet: loginAssessment.subnet
            });
        })
    );

    server.post(
        '/api/account/token',
        wrapAsync(async (req, res) => {
            if (!req.body.token) {
                return res.send({ success: false, message: 'Refresh token must be specified' });
            }

            let token = req.body.token;

            let user = await userService.getUserByUsername(token.username);
            if (!user) {
                return res.send({ success: false, message: 'Invalid refresh token' });
            }

            if (user.username !== token.username) {
                logger.error(
                    `Username ${user.username} did not match token username ${token.username}`
                );
                return res.send({ success: false, message: 'Invalid refresh token' });
            }

            let refreshToken = user.tokens.find((t) => {
                return t._id.toString() === token.id;
            });
            if (!refreshToken) {
                return res.send({ success: false, message: 'Invalid refresh token' });
            }

            if (!userService.verifyRefreshToken(user.username, refreshToken)) {
                return res.send({ success: false, message: 'Invalid refresh token' });
            }

            if (user.disabled) {
                return res.send({ success: false, message: 'Invalid refresh token' });
            }

            if (user.trustState === 'banned_evasion_review') {
                return res.send({ success: false, message: 'Invalid refresh token' });
            }

            let userObj = user.getWireSafeDetails();

            let ip = getRequestIp(req);
            let subnet = abuseService.getSubnet(ip);

            let authToken = jwt.sign(userObj, configService.getValue('secret'), {
                expiresIn: '5m'
            });

            await userService.updateRefreshTokenUsage(refreshToken.id, ip);
            await abuseService.updateUserSessionMetadata(user.username, { ip, subnet });

            res.send({ success: true, data: { user: userObj, token: authToken } });
        })
    );

    server.post(
        '/api/account/password-reset-finish',
        wrapAsync(async (req, res) => {
            if (!req.body.id || !req.body.token || !req.body.newPassword) {
                return res.send({ success: false, message: 'Invalid parameters' });
            }

            if (!req.body.id.match(/^[a-f\d]{24}$/i)) {
                return res.send({ success: false, message: 'Invalid parameters' });
            }

            let user = await userService.getUserById(req.body.id);
            if (!user) {
                logger.error('Got unexpected reset request for unknown user %s', req.body.id);

                return res.send({
                    success: false,
                    message:
                        'An error occured resetting your password, check the url you have entered and try again.'
                });
            }

            let passwordMessage = validatePassword(req.body.newPassword);
            if (passwordMessage) {
                return res.send({
                    success: false,
                    message: passwordMessage
                });
            }

            if (!user.resetToken && !user.resetTokenHash) {
                logger.error('Got unexpected reset request for user %s', user.username);

                return res.send({
                    success: false,
                    message:
                        'An error occured resetting your password, check the url you have entered and try again.'
                });
            }

            let resetExpiry = getResetExpiryDate(user);
            if (!resetExpiry || resetExpiry.getTime() <= Date.now()) {
                logger.error('Token expired %s', user.username);

                return res.send({
                    success: false,
                    message: 'The reset token you have provided has expired.'
                });
            }

            let hashedToken = hashActivationToken(req.body.token);
            let expectedToken =
                user.resetTokenHash || (user.resetToken ? getLegacyResetToken(user) : undefined);
            let providedToken = user.resetTokenHash ? hashedToken : req.body.token;

            if (!tokensMatch(expectedToken, providedToken)) {
                logger.error('Invalid reset token %s %s', user.username, req.body.token);

                return res.send({
                    success: false,
                    message:
                        'An error occured resetting your password, check the url you have entered and try again.'
                });
            }

            let passwordHash = await hashPassword(req.body.newPassword, 10);
            await userService.setPassword(user, passwordHash);
            await userService.clearResetToken(user);

            res.send({ success: true });
        })
    );

    server.post(
        '/api/account/password-reset',
        wrapAsync(async (req, res) => {
            const captchaResult = await verifyCaptchaToken(req.body.captcha);
            if (!captchaResult.success) {
                return res.send({
                    success: false,
                    message: captchaResult.message
                });
            }

            res.send({ success: true });

            let user = await userService.getUserByUsername(req.body.username);
            if (!user) {
                logger.error('Username not found for password reset %s', req.body.username);

                return;
            }

            let resetToken = createResetToken();

            await userService.setResetToken(user, resetToken.tokenHash, resetToken.expiresAt);
            let url = `${req.protocol}://${req.get('host')}/reset-password?id=${user._id}&token=${resetToken.token}`;
            let emailText =
                `Hi,\n\nSomeone, hopefully you, has requested their password on ${appName} (${req.protocol}://${req.get('host')}) to be reset.  If this was you, click this link ${url} to complete the process.\n\n` +
                'If you did not request this reset, do not worry, your account has not been affected and your password has not been changed, just ignore this email.\n' +
                'Kind regards,\n\n' +
                `${appName} team`;

            await emailService.sendEmail(user.email, `${appName} - Password reset`, emailText);
        })
    );

    server.put(
        '/api/account/:username',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async (req, res) => {
            let userToSet = req.body;

            if (req.user.username !== req.params.username) {
                return res.status(403).send({ message: 'Unauthorized' });
            }

            let user = await userService.getUserByUsername(req.params.username);
            if (!user) {
                return res.status(404).send({ message: 'Not found' });
            }

            user = user.getDetails();

            user.email = userToSet.email;
            user.settings = userToSet.settings;
            user.promptedActionWindows = userToSet.promptedActionWindows;

            if (userToSet.password && userToSet.password !== '') {
                user.password = await hashPassword(userToSet.password, 10);
            }

            user.enableGravatar = userToSet.enableGravatar;

            await downloadAvatar(user);

            await userService.update(user);

            let updatedUser = await userService.getUserById(user._id);
            let safeUser = updatedUser.getWireSafeDetails();
            let authToken;

            if (!safeUser.disabled && !safeUser.verified) {
                authToken = jwt.sign(safeUser, configService.getValue('secret'), {
                    expiresIn: '5m'
                });
            }

            res.send(
                Object.assign(
                    { success: true },
                    { data: { user: updatedUser.getWireSafeDetails(), token: authToken } }
                )
            );
        })
    );

    server.get(
        '/api/account/:username/sessions',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async (req, res) => {
            let user = await checkAuth(req, res);

            if (!user) {
                return;
            }

            let tokens = user.tokens || [];

            res.send({
                success: true,
                data: tokens
                    .sort((a, b) => {
                        return a.lastUsed < b.lastUsed;
                    })
                    .map((t) => {
                        return {
                            id: t._id,
                            ip: t.ip,
                            lastUsed: t.lastUsed
                        };
                    })
            });
        })
    );

    server.delete(
        '/api/account/:username/sessions/:id',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async (req, res) => {
            if (!req.params.username) {
                return res.send({ success: false, message: 'Username is required' });
            }

            if (!req.params.id) {
                return res.send({ success: false, message: 'Session Id is required' });
            }

            let user = await checkAuth(req, res);

            if (!user) {
                return;
            }

            let session = await userService.getRefreshTokenById(req.params.username, req.params.id);
            if (!session) {
                return res.status(404).send({ message: 'Not found' });
            }

            await userService.removeRefreshToken(req.params.username, req.params.id);

            res.send({
                success: true,
                data: { message: 'Session deleted successfully', tokenId: req.params.id }
            });
        })
    );

    server.get(
        '/api/account/:username/blocklist',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async (req, res) => {
            let user = await checkAuth(req, res);

            if (!user) {
                return;
            }

            let blockList = user.blockList || [];
            res.send({ success: true, data: blockList.sort() });
        })
    );

    server.post(
        '/api/account/:username/blocklist',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async (req, res) => {
            let user = await checkAuth(req, res);

            if (!user) {
                return;
            }

            if (!user.blockList) {
                user.blockList = [];
            }

            let lowerCaseUser = req.body.username.toLowerCase();

            if (
                user.blockList.find((user) => {
                    return user === lowerCaseUser;
                })
            ) {
                return res.send({ success: false, message: 'Entry already on block list' });
            }

            user.blockList.push(lowerCaseUser);

            await userService.updateBlockList(user);
            let updatedUser = await userService.getUserById(user._id);

            res.send({
                success: true,
                data: {
                    message: 'Block list entry added successfully',
                    username: lowerCaseUser,
                    user: updatedUser.getWireSafeDetails()
                }
            });
        })
    );

    server.delete(
        '/api/account/:username/blocklist/:entry',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async (req, res) => {
            let user = await checkAuth(req, res);

            if (!user) {
                return;
            }

            user = user.getDetails();

            if (!req.params.entry) {
                return res.send({ success: false, message: 'Parameter "entry" is required' });
            }

            if (!user.blockList) {
                user.blockList = [];
            }

            let lowerCaseUser = req.params.entry.toLowerCase();

            if (
                !user.blockList.find((user) => {
                    return user === lowerCaseUser;
                })
            ) {
                return res.status(404).send({ message: 'Not found' });
            }

            user.blockList = _.reject(user.blockList, (user) => {
                return user === lowerCaseUser;
            });

            await userService.updateBlockList(user);
            let updatedUser = await userService.getUserById(user._id);

            res.send({
                success: true,
                data: {
                    message: 'Block list entry removed successfully',
                    username: lowerCaseUser,
                    user: updatedUser.getWireSafeDetails()
                }
            });
        })
    );

    server.post(
        '/api/account/:username/updateavatar',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async (req, res) => {
            let user = await checkAuth(req, res);

            if (!user) {
                return;
            }

            user = user.getDetails();

            await downloadAvatar(user);

            res.send({ success: true });
        })
    );

    server.post(
        '/api/account/linkPatreon',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async (req, res) => {
            req.params.username = req.user ? req.user.username : undefined;

            let user = await checkAuth(req, res);

            if (!user) {
                return;
            }

            if (!req.body.code) {
                return res.send({ success: false, message: 'Code is required' });
            }

            user = await patreonService.linkAccount(req.params.username, req.body.code);
            if (!user) {
                return res.send({
                    success: false,
                    message:
                        'An error occured syncing your patreon account.  Please try again later.'
                });
            }

            let status = await patreonService.getPatreonStatusForUser(user);

            if (status === 'pledged' && !user.permissions.isSupporter) {
                await userService.setSupporterStatus(user.username, true);
                // eslint-disable-next-line require-atomic-updates
                user.permissions.isSupporter = req.user.permissions.isSupporter = true;
            } else if (status !== 'pledged' && user.permissions.isSupporter) {
                await userService.setSupporterStatus(user.username, false);
                // eslint-disable-next-line require-atomic-updates
                user.permissions.isSupporter = req.user.permissions.isSupporter = false;
            }

            return res.send({ success: true });
        })
    );

    server.post(
        '/api/account/unlinkPatreon',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async (req, res) => {
            req.params.username = req.user ? req.user.username : undefined;

            let user = await checkAuth(req, res);

            if (!user) {
                return;
            }

            let ret = await patreonService.unlinkAccount(req.params.username);
            if (!ret) {
                return res.send({
                    success: false,
                    message:
                        'An error occured unlinking your patreon account.  Please try again later.'
                });
            }

            return res.send({ success: true });
        })
    );
};

async function downloadAvatar(user) {
    const emailHash = user.enableGravatar
        ? crypto.createHash('md5').update(user.email).digest('hex')
        : DefaultEmailHash;
    const avatar = await fetch(`https://www.gravatar.com/avatar/${emailHash}?d=identicon&s=24`);
    const arrayBuffer = await avatar.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(`public/img/avatar/${user.username}.png`, buffer);
}

async function checkAuth(req, res) {
    let user = await userService.getUserByUsername(req.params.username);

    if (!req.user) {
        res.status(401).send({ message: 'Unauthorized' });

        return null;
    }

    if (req.user.username !== req.params.username) {
        res.status(403).send({ message: 'Forbidden' });

        return null;
    }

    if (!user) {
        res.status(401).send({ message: 'Unauthorized' });

        return null;
    }

    return user;
}
