const UserService = require('../repositories/UserService.js');
const logger = require('../log.js');
const config = require('../config.js');

let userService = new UserService({ dbPath: config.dbPath });

module.exports.init = function(server) {
    server.get('/api/user/:username', function(req, res) {
        if(!req.user) {
            return res.status(401);
        }

        if(!req.user.permissions || !req.user.permissions.canManageUsers) {
            return res.status(403);
        }

        userService.getUserByUsername(req.params.username)
            .then(user => {
                if(!user) {
                    res.status(404).send({ message: 'Not found'});

                    return Promise.reject('User not found');
                }

                res.send({ success: true, user: user });
            })
            .catch(() => {
            });
    });
};
