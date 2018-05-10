const monk = require('monk');
const passport = require('passport');

const UserService = require('../services/UserService.js');
const logger = require('../log.js');
const config = require('../config.js');

let db = monk(config.dbPath);
let userService = new UserService(db);

module.exports.init = function(server) {
    server.get('/api/user/:username', passport.authenticate('jwt', { session: false }), function(req, res) {
        if(!req.user.permissions || !req.user.permissions.canManageUsers) {
            return res.status(403);
        }

        userService.getUserByUsername(req.params.username)
            .then(user => {
                if(!user) {
                    res.status(404).send({ message: 'Not found' });

                    return Promise.reject('User not found');
                }

                res.send({ success: true, user: user.getDetails() });
            })
            .catch(err => {
                logger.error(err);
            });
    });

    server.put('/api/user/:username', passport.authenticate('jwt', { session: false }), function(req, res) {
        if(!req.user.permissions || !req.user.permissions.canManageUsers) {
            return res.status(403);
        }

        let userToSet = req.body.userToChange;

        userService.getUserByUsername(req.params.username)
            .then(dbUser => {
                let user = dbUser.getDetails();

                if(!user) {
                    return res.status(404).send({ message: 'Not found' });
                }

                if(req.user.permissions.canManagePermissions) {
                    user.permissions = userToSet.permissions;
                }

                user.verified = userToSet.verified;
                user.disabled = userToSet.disabled;

                return userService.update(user);
            })
            .then(() => {
                res.send({ success: true });
            })
            .catch(() => {
                return res.send({ success: false, message: 'An error occured saving the user' });
            });
    });
};
