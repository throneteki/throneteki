const monk = require('monk');
const config = require('../config.js');
const logger = require('../log.js');
const DeckService = require('../services/DeckService.js');

let db = monk(config.dbPath);
let deckService = new DeckService(db);

module.exports.init = function(server) {
    server.get('/api/decks/:id', function(req, res, next) {
        if(!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        if(!req.params.id || req.params.id === '') {
            return res.status(404).send({ message: 'No such deck' });
        }

        deckService.getById(req.params.id)
            .then(deck => {
                if(!deck) {
                    res.status(404).send({ message: 'No such deck' });

                    return next();
                }

                if(deck.username !== req.user.username) {
                    return res.status(401).send({ message: 'Unauthorized' });
                }

                res.send({ success: true, deck: deck });
            })
            .catch(err => {
                res.send({ success: false, message: 'Error fetching deck' });
                logger.info(err.message);
                return next(err);
            });
    });

    server.get('/api/decks', function(req, res, next) {
        if(!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        deckService.findByUserName(req.user.username)
            .then(decks => {
                res.send({ success: true, decks: decks });
            })
            .catch(err => {
                logger.info(err);
                return next(err);
            });
    });

    server.put('/api/decks/:id', function(req, res, next) {
        if(!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        deckService.getById(req.params.id)
            .then(deck => {
                if(!deck) {
                    res.status(404).send({ message: 'No such deck' });

                    return next();
                }

                if(deck.username !== req.user.username) {
                    return res.status(401).send({ message: 'Unauthorized' });
                }

                let data = Object.assign({ id: req.params.id }, JSON.parse(req.body.data));

                deckService.update(data);

                res.send({ success: true, message: 'Saved' });
            })
            .catch(err => {
                res.send({ success: false, message: 'Error saving deck' });
                logger.info(err.message);
                return next(err);
            });
    });

    server.post('/api/decks', function(req, res, next) {
        if(!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        let data = Object.assign({ username: req.user.username }, JSON.parse(req.body.data));

        deckService.create(data)
            .then(() => {
                res.send({ success: true });
            })
            .catch(err => {
                logger.info(err);
                return next(err);
            });
    });

    server.delete('/api/decks/:id', function(req, res, next) {
        if(!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        let id = req.params.id;

        deckService.getById(id)
            .then(deck => {
                if(!deck) {
                    res.status(404).send({ success: false, message: 'No such deck' });

                    return next();
                }

                if(deck.username !== req.user.username) {
                    return res.status(401).send({ message: 'Unauthorized' });
                }

                deckService.delete(id)
                    .then(() => {
                        res.send({ success: true, message: 'Deck deleted successfully', deckId: id });
                    })
                    .catch(err => {
                        res.send({ success: false, message: 'Error deleting deck' });
                        logger.info(err.message);
                        return next(err);
                    });
            })
            .catch(err => {
                res.send({ success: false, message: 'Error fetching deck' });
                logger.info(err.message);
                return next(err);
            });
    });
};
