const db = require('monk')('mongodb://127.0.0.1:27017/throneteki');
const users = db.get('users');
const escapeRegex = require('../util.js').escapeRegex;

class UserRepository {
    getUserByUsername(username) {
        return users.findOne({ username: {'$regex': new RegExp('^' + escapeRegex(username.toLowerCase()) + '$', 'i') }});
    }

    addUser(user) {
        return users.insert(user);
    }

    setResetToken(user, token, tokenExpiration) {
        return users.update({ username: user.username }, { '$set': { resetToken: token, tokenExpires: tokenExpiration } });
    }
}

module.exports = UserRepository;
