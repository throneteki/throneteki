import passport from 'passport';
import { wrapAsync } from '../util.js';
import ServiceFactory from '../services/ServiceFactory.js';
import logger from '../log.js';

export const init = function(server, options) {
    let userService = ServiceFactory.userService(options.db, ServiceFactory.configService());

    server.get('/api/user/:username', passport.authenticate('jwt', { session: false }), wrapAsync(async (req, res) => {
        if(!req.user.permissions || !req.user.permissions.canManageUsers) {
            return res.status(403);
        }

        let user;
        let linkedAccounts;
        try {
            user = await userService.getUserByUsername(req.params.username);

            if(!user) {
                return res.status(404).send({ message: 'Not found' });
            }

            linkedAccounts = await userService.getPossiblyLinkedAccounts(user);
        } catch(error) {
            logger.error(error);

            return res.send({ success: false, message: 'An error occurred searching the user.  Please try again later.' });
        }

        res.send({ success: true, user: user.getFullDetails(), linkedAccounts: linkedAccounts && linkedAccounts.map(account => account.username).filter(name => name !== user.username) });
    }));

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
