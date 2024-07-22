import CardService from '../services/CardService.js';
import Factions from '../game/Factions.js';

export const init = function (server, options) {
    let cardService = new CardService(options.db);

    server.get('/api/cards', function (req, res, next) {
        cardService
            .getAllCards()
            .then((cards) => {
                res.send({ success: true, data: cards });
            })
            .catch((err) => {
                return next(err);
            });
    });

    server.get('/api/packs', function (req, res, next) {
        cardService
            .getAllPacks()
            .then((packs) => {
                res.send({ success: true, data: packs });
            })
            .catch((err) => {
                return next(err);
            });
    });

    server.get('/api/factions', function (req, res) {
        res.send({ success: true, data: Factions });
    });

    server.get('/api/restricted-list', function (req, res, next) {
        cardService
            .getRestrictedList()
            .then((restrictedList) => {
                res.send({ success: true, data: restrictedList });
            })
            .catch((err) => {
                next(err);
            });
    });
};
