import passport from 'passport';
import { wrapAsync } from '../util.js';
import ServiceFactory from '../services/ServiceFactory.js';

function extractEventFromRequest(req) {
    const {
        banned,
        defaultRestrictedList,
        draftOptions,
        eventGameOptions,
        format,
        name,
        pods,
        restricted,
        restrictSpectators,
        useDefaultRestrictedList,
        useEventGameOptions,
        validSpectators,
        lockDecks
    } = req.body.event;
    return {
        id: req.params.id,
        banned,
        defaultRestrictedList,
        draftOptions,
        eventGameOptions,
        format,
        name,
        pods,
        restricted,
        restrictSpectators,
        useDefaultRestrictedList,
        useEventGameOptions,
        validSpectators,
        lockDecks
    };
}

export const init = function (server, options) {
    const eventService = ServiceFactory.eventService(options.db);

    server.get(
        '/api/events',
        wrapAsync(async function (req, res) {
            const events = await eventService.getEvents();

            return res.send({ success: true, events });
        })
    );

    server.post(
        '/api/events',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            if (!req.user.permissions || !req.user.permissions.canManageEvents) {
                return res.status(403).send({ message: 'Forbidden' });
            }

            const event = extractEventFromRequest(req);

            eventService
                .create(event)
                .then((e) => {
                    res.send({ success: true, event: e });
                })
                .catch(() => {
                    return res.send({
                        success: false,
                        message: 'An error occured adding the event'
                    });
                });
        })
    );

    server.put(
        '/api/events/:id',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            if (!req.user.permissions || !req.user.permissions.canManageEvents) {
                return res.status(403).send({ message: 'Forbidden' });
            }

            const event = extractEventFromRequest(req);

            eventService
                .update(event)
                .then((e) => {
                    res.send({ success: true, event: e });
                })
                .catch(() => {
                    return res.send({
                        success: false,
                        message: 'An error occured adding the event'
                    });
                });
        })
    );

    server.delete(
        '/api/events/:id',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            if (!req.user.permissions || !req.user.permissions.canManageEvents) {
                return res.status(403).send({ message: 'Forbidden' });
            }

            const eventId = req.params.id;

            eventService
                .delete(eventId)
                .then(() => {
                    res.send({ success: true, eventId });
                })
                .catch(() => {
                    return res.send({
                        success: false,
                        message: 'An error occured deleting the event'
                    });
                });
        })
    );
};
