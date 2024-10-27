import passport from 'passport';
import qs from 'qs';

import DeckService from '../services/DeckService.js';
import { wrapAsync } from '../util.js';

export const init = async function (server, options) {
    let deckService = new DeckService(options.db, options.cardService);

    await deckService.init();

    server.get(
        '/api/decks/:id',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            if (!req.params.id || req.params.id === '') {
                return res.status(404).send({ message: 'No such deck' });
            }

            let deck = await deckService.getById(req.params.id);

            if (!deck) {
                return res.status(404).send({ message: 'No such deck' });
            }

            if (deck.username !== req.user.username) {
                return res.status(401).send({ message: 'Unauthorized' });
            }

            res.send({ success: true, data: deck });
        })
    );

    server.get(
        '/api/decks',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            let decks = await deckService.findByUserName(
                req.user.username,
                qs.parse(req._parsedUrl.query, { allowDots: true })
            );
            res.send(decks);
        })
    );

    server.put(
        '/api/decks/:id',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            let deck = await deckService.getById(req.params.id);

            if (!deck) {
                return res.status(404).send({ message: 'No such deck' });
            }

            if (deck.username !== req.user.username) {
                return res.status(401).send({ message: 'Unauthorized' });
            }

            let data = Object.assign({ id: req.params.id }, req.body);

            deckService.update(data);

            res.send({ success: true });
        })
    );

    server.post(
        '/api/decks',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            let deck = Object.assign(req.body, { username: req.user.username });
            await deckService.create(deck);
            res.send({ success: true });
        })
    );

    server.delete(
        '/api/decks',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            let deckIds = req.body.deckIds;

            for (const deckId of deckIds) {
                let deck = await deckService.getById(deckId);

                if (!deck) {
                    continue;
                }

                if (deck.username !== req.user.username) {
                    return res.status(401).send({ message: 'Unauthorized' });
                }

                await deckService.delete(deckId);
            }
            res.send({ success: true });
        })
    );

    server.delete(
        '/api/decks/:id',
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async function (req, res) {
            let id = req.params.id;

            let deck = await deckService.getById(id);

            if (!deck) {
                return res.status(404).send({ success: false, message: 'No such deck' });
            }

            if (deck.username !== req.user.username) {
                return res.status(401).send({ message: 'Unauthorized' });
            }

            await deckService.delete(id);
            res.send({ success: true, data: id });
        })
    );

    server.get('/api/standalone-decks', function (req, res, next) {
        deckService
            .getStandaloneDecks()
            .then((decks) => {
                res.send({ success: true, data: decks });
            })
            .catch((err) => {
                next(err);
            });
    });
};
