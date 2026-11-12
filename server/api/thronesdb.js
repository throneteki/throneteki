import passport from 'passport';

import { wrapAsync } from '../util.js';
import ServiceFactory from '../services/ServiceFactory.js';
import logger from '../log.js';
import { toThronetekiDeck, unknownCardCodes } from '../services/ThronesDbService.js';

const StatePattern = /^[a-f\d]{32}$/;
const LinkRequiredMessage = 'You need to link your ThronesDB account';
const RelinkRequiredMessage = 'Your ThronesDB link has expired, please link your account again';
const FetchErrorMessage =
    'An error occured fetching your decks from ThronesDB, please try again later';

export const init = function (server) {
    const userService = ServiceFactory.userService();
    const deckService = ServiceFactory.deckService();
    const thronesDbService = ServiceFactory.thronesDbService();

    const authenticate = passport.authenticate('jwt', { session: false });

    async function getUser(req, res) {
        const user = await userService.getUserByUsername(req.user.username);
        if (!user) {
            res.status(404).send({ success: false, message: 'User not found' });
        }

        return user;
    }

    function sendLinkError(user, res, message) {
        const { needsRelink } = thronesDbService.getStatus(user);

        res.send({
            success: false,
            message: needsRelink ? RelinkRequiredMessage : message,
            needsRelink
        });
    }

    async function getThronesDbDecks(user, res) {
        const status = thronesDbService.getStatus(user);
        if (!status.linked || status.needsRelink) {
            sendLinkError(user, res, LinkRequiredMessage);
            return undefined;
        }

        const decks = await thronesDbService.getDecks(user);
        if (!Array.isArray(decks)) {
            sendLinkError(user, res, FetchErrorMessage);
            return undefined;
        }

        return decks;
    }

    async function saveDecks(username, thronesDbDecks, save) {
        const codes = thronesDbDecks.flatMap((deck) => [
            ...(deck.agendas || []),
            ...Object.keys(deck.slots || {})
        ]);
        const cards = await deckService.getCards([...new Set(codes)]);
        const result = {
            created: 0,
            updated: 0,
            skipped: 0,
            locked: 0,
            unknownCards: 0,
            failed: 0
        };

        for (const thronesDbDeck of thronesDbDecks) {
            if (thronesDbDeck.uuid && unknownCardCodes(thronesDbDeck, cards).length > 0) {
                result.unknownCards++;
                continue;
            }

            const deck = thronesDbDeck.uuid && toThronetekiDeck(thronesDbDeck, cards);
            if (!deck) {
                result.failed++;
                continue;
            }

            try {
                result[await save(username, deck)]++;
            } catch (err) {
                logger.error('Error saving thronesdb deck %s %s', deck.thronesDbUuid, err);
                result.failed++;
            }
        }

        return result;
    }

    server.get(
        '/api/thronesdb/status',
        authenticate,
        wrapAsync(async (req, res) => {
            const user = await getUser(req, res);
            if (!user) {
                return;
            }

            res.send({
                success: true,
                data: {
                    configured: thronesDbService.isConfigured(),
                    ...thronesDbService.getStatus(user)
                }
            });
        })
    );

    server.get(
        '/api/thronesdb/authorize-url',
        authenticate,
        wrapAsync(async (req, res) => {
            if (!thronesDbService.isConfigured()) {
                return res.send({ success: false, message: 'ThronesDB linking is not available' });
            }

            if (typeof req.query.state !== 'string' || !StatePattern.test(req.query.state)) {
                return res.status(400).send({ success: false, message: 'Invalid state' });
            }

            res.send({ success: true, data: thronesDbService.getAuthorizeUrl(req.query.state) });
        })
    );

    server.post(
        '/api/thronesdb/link',
        authenticate,
        wrapAsync(async (req, res) => {
            if (typeof req.body.code !== 'string' || !req.body.code) {
                return res.status(400).send({ success: false, message: 'Code is required' });
            }

            if (!(await thronesDbService.linkAccount(req.user.username, req.body.code))) {
                return res.send({
                    success: false,
                    message:
                        'An error occured linking your ThronesDB account, please try again later'
                });
            }

            res.send({ success: true });
        })
    );

    server.post(
        '/api/thronesdb/unlink',
        authenticate,
        wrapAsync(async (req, res) => {
            if (!(await thronesDbService.unlinkAccount(req.user.username))) {
                return res.send({
                    success: false,
                    message:
                        'An error occured unlinking your ThronesDB account, please try again later'
                });
            }

            res.send({ success: true });
        })
    );

    server.get(
        '/api/thronesdb/decks',
        authenticate,
        wrapAsync(async (req, res) => {
            const user = await getUser(req, res);
            if (!user) {
                return;
            }

            const decks = await getThronesDbDecks(user, res);
            if (!decks) {
                return;
            }

            const imported = await deckService.getThronesDbUuids(user.username);

            res.send({
                success: true,
                data: decks.map((deck) => ({
                    id: deck.id,
                    uuid: deck.uuid,
                    name: deck.name,
                    factionCode: deck.faction_code,
                    factionName: deck.faction_name,
                    dateCreation: deck.date_creation,
                    dateUpdate: deck.date_update,
                    version: deck.version,
                    isImported: imported.has(deck.uuid)
                }))
            });
        })
    );

    server.post(
        '/api/thronesdb/decks',
        authenticate,
        wrapAsync(async (req, res) => {
            const deckIds = req.body.deckIds;
            if (!Array.isArray(deckIds) || deckIds.some((id) => !Number.isInteger(id))) {
                return res.status(400).send({ success: false, message: 'Invalid deck ids' });
            }

            const user = await getUser(req, res);
            if (!user) {
                return;
            }

            const decks = await getThronesDbDecks(user, res);
            if (!decks) {
                return;
            }

            const selected = decks.filter((deck) => deckIds.includes(deck.id));

            res.send({
                success: true,
                data: await saveDecks(user.username, selected, (username, deck) =>
                    deckService.importThronesDbDeck(username, deck)
                )
            });
        })
    );

    server.post(
        '/api/thronesdb/sync',
        authenticate,
        wrapAsync(async (req, res) => {
            const user = await getUser(req, res);
            if (!user) {
                return;
            }

            const decks = await getThronesDbDecks(user, res);
            if (!decks) {
                return;
            }

            const imported = await deckService.getThronesDbUuids(user.username);
            const linked = decks.filter((deck) => imported.has(deck.uuid));

            res.send({
                success: true,
                data: await saveDecks(user.username, linked, (username, deck) =>
                    deckService.syncThronesDbDeck(username, deck)
                )
            });
        })
    );
};
