import passport from 'passport';
import { wrapAsync } from '../util.js';
import ServiceFactory from '../services/ServiceFactory.js';

function extractEventFromRequest(req) {
    const {
        name,
        format,
        variant,
        legality,
        gameType,
        lockDecks,
        useEventGameOptions,
        eventGameOptions,
        validTableCreators,
        validSpectators
    } = req.body;

    return {
        _id: req.params.id,
        name,
        format,
        variant,
        legality,
        gameType,
        lockDecks,
        useEventGameOptions,
        eventGameOptions: useEventGameOptions
            ? {
                  password: eventGameOptions.password,
                  spectators: eventGameOptions.spectators,
                  muteSpectators: eventGameOptions.muteSpectators,
                  showHand: eventGameOptions.showHand,
                  useGameTimeLimit: eventGameOptions.useGameTimeLimit,
                  gameTimeLimit: eventGameOptions.gameTimeLimit,
                  useChessClocks: eventGameOptions.useChessClocks,
                  chessClockTimeLimit: eventGameOptions.chessClockTimeLimit,
                  chessClockDelay: eventGameOptions.chessClockDelay,
                  randomSeats: eventGameOptions.randomSeats,
                  allowMultipleWinners: eventGameOptions.allowMultipleWinners
              }
            : null,
        validTableCreators,
        validSpectators
    };
}

export const init = async function (server, options) {
    const eventService = ServiceFactory.eventService(options.db);

    await eventService.init();

    server.get(
        '/api/events',
        wrapAsync(async function (req, res) {
            const events = await eventService.getEvents();

            return res.send({ success: true, data: events });
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
                    res.send({ success: true, data: e });
                })
                .catch(() => {
                    return res.send({
                        success: false,
                        message: 'An error occured adding the event'
                    });
                });
        })
    );

    server.get(
        '/api/events/:id',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            if (!req.user.permissions || !req.user.permissions.canManageEvents) {
                return res.status(403).send({ message: 'Forbidden' });
            }
            const eventId = req.params.id;

            try {
                const event = await eventService.getEventById(eventId);

                if (!event) {
                    return res.status(404).send({ message: 'Event not found' });
                }

                return res.send({ success: true, data: event });
            } catch (err) {
                return res.send({
                    success: false,
                    message: 'An error occured fetching the event'
                });
            }
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
                    res.send({ success: true, data: e });
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
