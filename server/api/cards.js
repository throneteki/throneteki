const config = require('../config.js');
const CardService = require('../repositories/cardService.js');

var cardService = new CardService({ dbPath: config.dbPath });

module.exports.init = function(server) {
    server.get('/api/cards', function(req, res, next) {
        cardService.getAllCards({ shortForm: true })
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
        let factions = [
            { name: 'House Baratheon', value: 'baratheon' },
            { name: 'House Greyjoy', value: 'greyjoy' },
            { name: 'House Lannister', value: 'lannister' },
            { name: 'House Martell', value: 'martell' },
            { name: 'The Night\'s Watch', value: 'thenightswatch' },
            { name: 'House Stark', value: 'stark' },
            { name: 'House Targaryen', value: 'targaryen' },
            { name: 'House Tyrell', value: 'tyrell' }
        ];
        res.send({ success: true, factions: factions });
    });
};
