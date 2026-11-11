import ServiceFactory from '../services/ServiceFactory.js';
import WrappedEmailService from '../services/WrappedEmailService.js';
import { wrapAsync } from '../util.js';

export const init = function (server) {
    const wrappedEmailService = new WrappedEmailService(ServiceFactory.configService());

    // Used by the unsubscribe page, and by mail clients' one-click unsubscribe (RFC 8058), which POSTs to the
    // List-Unsubscribe address with the id and token in the query string
    server.post(
        '/api/unsubscribe',
        wrapAsync(async function (req, res) {
            const id = req.query.id || req.body?.id;
            const token = req.query.token || req.body?.token;

            if (!(await wrappedEmailService.unsubscribe(id, token))) {
                return res
                    .status(400)
                    .send({ success: false, message: 'This unsubscribe link is not valid' });
            }

            res.send({ success: true });
        })
    );
};
