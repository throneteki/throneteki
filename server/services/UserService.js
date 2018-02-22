const escapeRegex = require('../util.js').escapeRegex;
const logger = require('../log.js');

class UserService {
    constructor(db) {
        this.users = db.get('users');
        this.sessions = db.get('sessions');
    }

    getUserByUsername(username) {
        return this.users.find({ username: { '$regex': new RegExp('^' + escapeRegex(username.toLowerCase()) + '$', 'i') } })
            .then(users => {
                return users[0];
            })
            .catch(err => {
                logger.error('Error fetching users', err);

                throw new Error('Error occured fetching users');
            });
    }

    getUserByEmail(email) {
        return this.users.find({ email: { '$regex': new RegExp('^' + escapeRegex(email.toLowerCase()) + '$', 'i') } })
            .then(users => {
                return users[0];
            })
            .catch(err => {
                logger.error('Error fetching users', err);

                throw new Error('Error occured fetching users');
            });
    }

    getUserById(id) {
        return this.users.find({ _id: id })
            .then(users => {
                return users[0];
            })
            .catch(err => {
                logger.error('Error fetching users', err);

                throw new Error('Error occured fetching users');
            });
    }

    addUser(user) {
        return this.users.insert(user)
            .then(() => {
                return user;
            })
            .catch(err => {
                logger.error('Error adding user', err, user);

                throw new Error('Error occured adding user');
            });
    }

    update(user) {
        var toSet = {
            email: user.email,
            settings: user.settings,
            promptedActionWindows: user.promptedActionWindows,
            permissions: user.permissions,
            verified: user.verified,
            disabled: user.disabled
        };

        if(user.password && user.password !== '') {
            toSet.password = user.password;
        }

        return this.users.update({ username: user.username }, { '$set': toSet }).catch(err => {
            logger.error(err);

            throw new Error('Error setting user details');
        });
    }

    updateBlockList(user) {
        return this.users.update({ username: user.username }, {
            '$set': {
                blockList: user.blockList
            }
        }).catch(err => {
            logger.error(err);

            throw new Error('Error setting user details');
        });
    }

    setResetToken(user, token, tokenExpiration) {
        return this.users.update({ username: user.username }, { '$set': { resetToken: token, tokenExpires: tokenExpiration } })
            .catch(err => {
                logger.error(err);

                throw new Error('Error setting reset token');
            });
    }

    setPassword(user, password) {
        return this.users.update({ username: user.username }, { '$set': { password: password } })
            .catch(err => {
                logger.error(err);

                throw new Error('Error setting password');
            });
    }

    clearResetToken(user) {
        return this.users.update({ username: user.username }, { '$set': { resetToken: undefined, tokenExpires: undefined } })
            .catch(err => {
                logger.error(err);

                throw new Error('Error clearing reset token');
            });
    }

    activateUser(user) {
        return this.users.update({ username: user.username }, { '$set': { activationToken: undefined, activationExpiry: undefined, verified: true } })
            .catch(err => {
                logger.error(err);

                throw new Error('Error activating user');
            });
    }

    clearUserSessions(username) {
        return this.getUserByUsername(username).then(user => {
            if(!user) {
                return;
            }

            this.sessions.remove({ session: { '$regex': new RegExp('^.*' + escapeRegex(user._id.toString()) + '.*$', 'i') } });
        });
    }
}

module.exports = UserService;
