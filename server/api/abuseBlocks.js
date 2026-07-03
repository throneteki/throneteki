import passport from 'passport';
import { wrapAsync } from '../util.js';
import ServiceFactory from '../services/ServiceFactory.js';

export const init = function (server, options) {
    const configService = ServiceFactory.configService();
    const abuseService = ServiceFactory.abuseService(options.db, configService);

    server.get(
        '/api/abuse-blocks',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async (req, res) => {
            if (!req.user.permissions || !req.user.permissions.canManageBanlist) {
                return res.status(403);
            }

            const blocks = await abuseService.listBlocks();

            return res.send({ success: true, data: blocks });
        })
    );

    server.post(
        '/api/abuse-blocks',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async (req, res) => {
            if (!req.user.permissions || !req.user.permissions.canManageBanlist) {
                return res.status(403);
            }

            if (!req.body.value) {
                return res.status(400).send({ success: false, message: 'Value is required' });
            }

            const scope = req.body.scope || 'ip';
            const value = String(req.body.value).trim().toLowerCase();
            const createdBlock = await abuseService.createBlock({
                scope,
                value,
                reason: req.body.reason,
                createdBy: req.user.username,
                expiresAt: req.body.expiresAt || null,
                sourceUserId: req.body.sourceUserId || null
            });

            return res.send({ success: true, data: createdBlock });
        })
    );

    server.delete(
        '/api/abuse-blocks/:id',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async (req, res) => {
            if (!req.user.permissions || !req.user.permissions.canManageBanlist) {
                return res.status(403);
            }

            await abuseService.deactivateBlock(req.params.id);

            return res.send({ success: true, data: { id: req.params.id } });
        })
    );
};
