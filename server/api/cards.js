const config = require('../config.js');
const logger = require('../log.js');
const CardRepository = require('../repositories/cardRepository.js');

var cardRepository = new CardRepository(config.dbPath);

module.exports.init = function(server) {
    server.get('/api/cards', function(req, res, next) {
        cardRepository.getCards(true, (err, cards) => {
            if(err) {
                logger.info(err);
                return next(err);
            }

            res.send({ success: true, cards: cards });
        });
    });

    server.get('/api/packs', function(req, res, next) {
        cardRepository.getPacks((err, data) => {
            if(err) {
                logger.info(err);
                return next(err);
            }

            res.send({ success: true, packs: data });
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
