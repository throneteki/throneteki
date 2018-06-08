const monk = require('monk');
const config = require('../config.js');
const CardService = require('../services/CardService.js');
const Factions = require('../game/Factions');

let db = monk(config.dbPath);
let cardService = new CardService(db);

module.exports.init = function(server) {
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
                res.send({ success: true, restrictedList: restrictedList });
            })
            .catch(err => {
                next(err);
            });
    });
};
