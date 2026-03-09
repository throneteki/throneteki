import monk from 'monk';
import moment from 'moment';
import crypto from 'crypto';
import EventEmitter from 'events';
import { escapeRegex } from '../util.js';
import logger from '../log.js';
import User from '../models/User.js';

class UserService extends EventEmitter {
    constructor(db, configService) {
        super();

        this.users = db.get('users');
        this.sessions = db.get('sessions');
        this.configService = configService;
    }

    parseStoredDate(value) {
        if (!value) {
            return undefined;
        }

        if (value instanceof Date) {
            return Number.isNaN(value.getTime()) ? undefined : value;
        }

        if (typeof value === 'number') {
            let numericDate = new Date(value);
            return Number.isNaN(numericDate.getTime()) ? undefined : numericDate;
        }

        let parsedDate = moment(value, [moment.ISO_8601, 'YYYYMMDD-HH:mm:ss'], true);
        if (!parsedDate.isValid()) {
            return undefined;
        }

        return parsedDate.toDate();
    }

    getUserByUsername(username) {
        return this.users
            .find({
                username: {
                    $regex: new RegExp('^' + escapeRegex(username.toLowerCase()) + '$', 'i')
                }
            })
            .then((users) => {
                return users[0] && new User(users[0]);
            })
            .catch((err) => {
                logger.error('Error fetching users %s', err);

                throw new Error('Error occured fetching users');
            });
    }

    getUserByEmail(email) {
        return this.users
            .find({
                email: { $regex: new RegExp('^' + escapeRegex(email.toLowerCase()) + '$', 'i') }
            })
            .then((users) => {
                return users[0] && new User(users[0]);
            })
            .catch((err) => {
                logger.error('Error fetching users %s', err);

                throw new Error('Error occured fetching users');
            });
    }

    getUserById(id) {
        return this.users
            .find({ _id: id })
            .then((users) => {
                return users[0] && new User(users[0]);
            })
            .catch((err) => {
                logger.error('Error fetching users %s', err);

                throw new Error('Error occured fetching users');
            });
    }

    addUser(user) {
        return this.users
            .insert(user)
            .then((insertedUser) => {
                return insertedUser;
            })
            .catch((err) => {
                logger.error('Error adding user %s %s', err, user);

                throw new Error('Error occured adding user');
            });
    }

    update(user) {
        const emailDomain =
            user.emailDomain ||
            (user.email && user.email.includes('@')
                ? user.email.substring(user.email.lastIndexOf('@') + 1).toLowerCase()
                : undefined);
        var toSet = {
            email: user.email,
            emailDomain: emailDomain,
            enableGravatar: user.enableGravatar,
            settings: user.settings,
            promptedActionWindows: user.promptedActionWindows,
            permissions: user.permissions,
            verified: user.verified,
            disabled: user.disabled,
            patreon: user.patreon,
            riskFlags: user.riskFlags || [],
            riskScore: user.riskScore || 0,
            trustState: user.trustState || 'trusted',
            restrictedUntil: user.restrictedUntil,
            evasionReviewRequired: !!user.evasionReviewRequired,
            modNotes: user.modNotes || null
        };

        if (user.password && user.password !== '') {
            toSet.password = user.password;
        }

        return this.users.update({ username: user.username }, { $set: toSet }).catch((err) => {
            logger.error(err);

            throw new Error('Error setting user details');
        });
    }

    updateBlockList(user) {
        return this.users
            .update(
                { username: user.username },
                {
                    $set: {
                        blockList: user.blockList
                    }
                }
            )
            .then(() => {
                this.emit('onBlocklistChanged', user);
            })
            .catch((err) => {
                logger.error(err);

                throw new Error('Error setting user details');
            });
    }

    setResetToken(user, tokenHash, tokenExpiration) {
        return this.users
            .update(
                { username: user.username },
                {
                    $set: {
                        resetTokenHash: tokenHash,
                        tokenExpires: tokenExpiration,
                        resetTokenVersion: 2,
                        resetTokenIssuedAt: new Date()
                    },
                    $unset: {
                        resetToken: ''
                    }
                }
            )
            .catch((err) => {
                logger.error(err);

                throw new Error('Error setting reset token');
            });
    }

    setPassword(user, password) {
        return this.users
            .update({ username: user.username }, { $set: { password: password } })
            .catch((err) => {
                logger.error(err);

                throw new Error('Error setting password');
            });
    }

    clearResetToken(user) {
        return this.users
            .update(
                { username: user.username },
                {
                    $unset: {
                        resetToken: '',
                        resetTokenHash: '',
                        tokenExpires: '',
                        resetTokenVersion: '',
                        resetTokenIssuedAt: ''
                    }
                }
            )
            .catch((err) => {
                logger.error(err);

                throw new Error('Error clearing reset token');
            });
    }

    async deleteExpiredUnverifiedAccounts({ email, username } = {}) {
        let identifiers = [];

        if (email) {
            identifiers.push({
                email: { $regex: new RegExp('^' + escapeRegex(email.toLowerCase()) + '$', 'i') }
            });
        }

        if (username) {
            identifiers.push({
                username: {
                    $regex: new RegExp('^' + escapeRegex(username.toLowerCase()) + '$', 'i')
                }
            });
        }

        try {
            let query = { verified: false };
            if (identifiers.length > 0) {
                query.$or = identifiers;
            }

            let pendingUsers = await this.users.find(query);

            let expiredUsers = pendingUsers.filter((user) => {
                if (!user.activationTokenExpiry) {
                    return false;
                }

                let expiry = this.parseStoredDate(user.activationTokenExpiry);
                return !!expiry && expiry.getTime() <= Date.now();
            });

            if (expiredUsers.length === 0) {
                return 0;
            }

            await Promise.all(
                expiredUsers.map((user) => {
                    return this.users.remove({ _id: user._id });
                })
            );

            return expiredUsers.length;
        } catch (err) {
            logger.error('Error deleting expired unverified accounts %s', err);
            return 0;
        }
    }

    activateUser(user) {
        return this.users
            .update(
                { username: user.username },
                {
                    $set: {
                        verified: true
                    },
                    $unset: {
                        activationToken: '',
                        activationTokenHash: '',
                        activationTokenExpiry: '',
                        activationTokenIssuedAt: '',
                        activationTokenVersion: ''
                    }
                }
            )
            .catch((err) => {
                logger.error(err);

                throw new Error('Error activating user');
            });
    }

    async cleanupRefreshTokens() {
        let refreshTokenRetentionDays =
            this.configService.getValue('refreshTokenRetentionDays') || 30;
        let cutoff = Date.now() - refreshTokenRetentionDays * 24 * 60 * 60 * 1000;
        let removedTokens = 0;
        let users = [];

        try {
            users = await this.users.find({ tokens: { $exists: true, $ne: [] } });
        } catch (err) {
            logger.error('Error fetching users for session cleanup %s', err);
            return 0;
        }

        await Promise.all(
            users.map(async (user) => {
                let originalTokens = user.tokens || [];
                let filteredTokens = originalTokens.filter((token) => {
                    let exp = this.parseStoredDate(token.exp);
                    if (exp && exp.getTime() <= Date.now()) {
                        removedTokens += 1;
                        return false;
                    }

                    let lastUsed = this.parseStoredDate(token.lastUsed);
                    if (lastUsed && lastUsed.getTime() < cutoff) {
                        removedTokens += 1;
                        return false;
                    }

                    return true;
                });

                if (filteredTokens.length === originalTokens.length) {
                    return;
                }

                await this.users.update({ _id: user._id }, { $set: { tokens: filteredTokens } });
            })
        );

        return removedTokens;
    }

    async cleanupLegacySessions() {
        let sessionHistoryRetentionDays =
            this.configService.getValue('sessionHistoryRetentionDays') || 180;
        let cutoff = Date.now() - sessionHistoryRetentionDays * 24 * 60 * 60 * 1000;
        let sessions = [];

        try {
            sessions = await this.sessions.find({});
        } catch (err) {
            logger.error('Error fetching legacy sessions for cleanup %s', err);
            return 0;
        }

        let expiredSessions = sessions.filter((session) => {
            let candidates = [
                session.lastUsed,
                session.updatedAt,
                session.expires,
                session.expiresAt,
                session.exp,
                session.createdAt
            ];

            let latestKnownDate = candidates
                .map((value) => this.parseStoredDate(value))
                .filter(Boolean)
                .sort((left, right) => right.getTime() - left.getTime())[0];

            if (!latestKnownDate) {
                return false;
            }

            return latestKnownDate.getTime() < cutoff;
        });

        if (expiredSessions.length === 0) {
            return 0;
        }

        await Promise.all(
            expiredSessions.map((session) => {
                return this.sessions.remove({ _id: session._id });
            })
        );

        return expiredSessions.length;
    }

    clearUserSessions(username) {
        return new Promise((resolve, reject) => {
            const user = this.getUserByUsername(username);
            if (!user) {
                return reject('User not found');
            }

            this.users.update({ username: username }, { $set: { tokens: [] } }).then(() => {
                resolve(true);
            });
        });
    }

    addRefreshToken(username, token, ip) {
        let expiration = moment().add(1, 'months');
        let hmac = crypto.createHmac('sha512', this.configService.getValue('hmacSecret'));

        let newId = monk.id();
        let encodedToken = hmac.update(`REFRESH ${username} ${newId}`).digest('hex');

        return this.users
            .update(
                { username: username },
                {
                    $push: {
                        tokens: {
                            _id: newId,
                            token: encodedToken,
                            exp: expiration.toDate(),
                            ip: ip,
                            lastUsed: new Date()
                        }
                    }
                }
            )
            .then(() => {
                return {
                    id: newId,
                    username: username,
                    token: encodedToken
                };
            })
            .catch((err) => {
                logger.error(err);

                return undefined;
            });
    }

    verifyRefreshToken(username, refreshToken) {
        let hmac = crypto.createHmac('sha512', this.configService.getValue('hmacSecret'));
        let encodedToken = hmac.update(`REFRESH ${username} ${refreshToken._id}`).digest('hex');

        if (encodedToken !== refreshToken.token) {
            return false;
        }

        let now = moment();
        if (refreshToken.exp < now) {
            return false;
        }

        return true;
    }

    updateRefreshTokenUsage(tokenId, ip) {
        return this.users
            .update(
                { tokens: { $elemMatch: { _id: tokenId } } },
                {
                    $set: { 'tokens.$.ip': ip, 'tokens.$.lastUsed': new Date() }
                }
            )
            .catch((err) => {
                logger.error(err);
            });
    }

    getRefreshTokenById(username, tokenId) {
        return this.users
            .find({ username: username, tokens: { $elemMatch: { _id: tokenId } } })
            .then((users) => {
                return users[0];
            })
            .catch((err) => {
                logger.error(err);
            });
    }

    removeRefreshToken(username, tokenId) {
        return this.users
            .update({ username: username }, { $pull: { tokens: { _id: tokenId } } })
            .catch((err) => {
                logger.error(err);
            });
    }

    setSupporterStatus(username, isSupporter) {
        return this.users.update(
            { username: username },
            { $set: { 'permissions.isSupporter': isSupporter } }
        );
    }

    async getPossiblyLinkedAccounts(user) {
        if (!user.tokens) {
            return [];
        }

        let ips = [...new Set(user.tokens.map((token) => token.ip).filter((ip) => ip))];

        return this.users.find({ 'tokens.ip': { $in: ips } }).catch((err) => {
            logger.error('Error finding related ips %s %s', err, user.username);
        });
    }
}

export default UserService;
