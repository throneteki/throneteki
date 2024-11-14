import passport from 'passport';
import { wrapAsync } from '../util.js';
import ServiceFactory from '../services/ServiceFactory.js';

export const init = function (server, options) {
    let banlistService = ServiceFactory.banlistService(options.db);

    server.get(
        '/api/banlist',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            if (!req.user.permissions || !req.user.permissions.canManageBanlist) {
                return res.status(403);
            }

            let banlist = await banlistService.getBanList();

            return res.send({ success: true, data: banlist });
        })
    );

    server.post(
        '/api/banlist',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            if (!req.user.permissions || !req.user.permissions.canManageBanlist) {
                return res.status(403);
            }

            let entry = await banlistService.getEntryByIp(req.body.ip);
            if (entry) {
                return res.status(400).send({ success: false, message: 'Already exists' });
            }

            entry = {
                ip: req.body.ip,
                user: req.user.username,
                added: new Date()
            };

            banlistService
                .addBanlistEntry(entry)
                .then((ip) => {
                    res.send({ success: true, entry: ip });
                })
                .catch(() => {
                    return res.send({
                        success: false,
                        message: 'An error occured adding the banlist entry'
                    });
                });
        })
    );
};
