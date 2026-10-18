import passport from 'passport';
import ServiceFactory from '../services/ServiceFactory.js';
import logger from '../log.js';

export const init = function (server) {
    let messageService = ServiceFactory.messageService();

    server.delete(
        '/api/messages/:messageId',
        passport.authenticate('jwt', { session: false }),
        function (req, res) {
            if (!req.user.permissions || !req.user.permissions.canModerateChat) {
                return res.status(403).send({ message: 'Forbidden' });
            }

            messageService
                .removeMessage(req.params.messageId, req.user)
                .then(() => {
                    res.send({ success: true });
                })
                .catch((err) => {
                    logger.error(err);
                    res.send({ success: false, message: 'An error occured deleting the message' });
                });
        }
    );
};
