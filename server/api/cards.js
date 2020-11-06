const CardService = require('../services/CardService');
const Factions = require('../game/Factions');

module.exports.init = function(server, options) {
    let cardService = new CardService(options.db);

    server.get('/api/cards', function(req, res, next) {
        cardService.getAllCards()
            .then(cards => {
                res.send({ success: true, cards: cards });
            })
            .catch(err => {
                return next(err);
            });
    });

    server.get('/api/packs', function(req, res, next) {
        cardService.getAllPacks()
            .then(packs => {
                res.send({ success: true, packs: packs });
            })
            .catch(err => {
                return next(err);
            });
    });

    server.get('/api/factions', function(req, res) {
        res.send({ success: true, factions: Factions });
    });

    server.get('/api/restricted-list', function(req, res, next) {
        cardService.getRestrictedList()
            .then(restrictedList => {
                //sort the restrictedList array by their release date, newest restricted list should be the first entry in the returned array
                restrictedList.sort((rl1, rl2) => rl1.date < rl2.date);
                res.send({ success: true, restrictedList: restrictedList });
            })
            .catch(err => {
                next(err);
            });
    });
};
