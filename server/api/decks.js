const mongoskin = require('mongoskin');
const db = mongoskin.db('mongodb://127.0.0.1:27017/throneteki');
const ObjectId = mongoskin.ObjectId;
const logger = require('../log.js');

module.exports.init = function(server) {
    server.get('/api/decks/:id', function(req, res, next) {
        if(!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        if(!req.params.id || req.params.id === '') {
            return res.status(404).send({ message: 'No such deck' });
        }

        db.collection('decks').findOne({ _id: ObjectId.createFromHexString(req.params.id) }, function(err, deck) {
            if(err) {
                res.send({ success: false, message: 'Error fetching deck' });
                logger.info(err.message);
                return next(err);
            }

            if(!deck) {
                res.status(404).send({ message: 'No such deck' });

                return next();
            }

            if(deck.username !== req.user.username) {
                return res.status(401).send({ message: 'Unauthorized' });
            }

            res.send({ success: true, deck: deck });
        });
    });

    server.get('/api/decks', function(req, res, next) {
        if(!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        db.collection('decks').find({ username: req.user.username }).sort({ lastUpdated: -1 }).toArray(function(err, data) {
            if(err) {
                logger.info(err);
                return next(err);
            }

            res.send({ success: true, decks: data });
        });
    });

    server.put('/api/decks/:id', function(req, res, next) {
        if(!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        db.collection('decks').findOne({ _id: ObjectId.createFromHexString(req.params.id) }, function(err, deck) {
            if(err) {
                res.send({ success: false, message: 'Error saving deck' });
                logger.info(err.message);
                return next(err);
            }

            if(!deck) {
                res.status(404).send({ message: 'No such deck' });

                return next();
            }

            if(deck.username !== req.user.username) {
                return res.status(401).send({ message: 'Unauthorized' });
            }

            var data = JSON.parse(req.body.data);

            db.collection('decks').update({ _id: mongoskin.helper.toObjectID(req.params.id) },
                {
                    '$set': {
                        name: data.deckName,
                        plotCards: data.plotCards,
                        drawCards: data.drawCards,
                        bannerCards: data.bannerCards,
                        faction: data.faction,
                        agenda: data.agenda,
                        lastUpdated: new Date()
                    }
                });

            res.send({ success: true, message: 'Saved' });
        });
    });

    server.post('/api/decks', function(req, res, next) {
        if(!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        var data = JSON.parse(req.body.data);

        db.collection('decks').insert({
            username: req.user.username,
            name: data.deckName,
            plotCards: data.plotCards,
            bannerCards: data.bannerCards,
            drawCards: data.drawCards,
            faction: data.faction,
            agenda: data.agenda,
            lastUpdated: new Date()
        }, function(err) {
            if(err) {
                logger.info(err);
                return next(err);
            }

            res.send({ success: true });
        });
    });

    server.delete('/api/decks/:id', function(req, res, next) {
        if(!req.user) {
            return res.status(401).send({ message: 'Unauthorized' });
        }

        db.collection('decks').findOne({ _id: ObjectId.createFromHexString(req.params.id) }, function(err, deck) {
            if(err) {
                res.send({ success: false, message: 'Error fetching deck' });
                logger.info(err.message);
                return next(err);
            }

            if(!deck) {
                res.send({ success: false, message: 'No such deck' });

                return next();
            }

            if(deck.username !== req.user.username) {
                return res.status(401).send({ message: 'Unauthorized' });
            }

            db.collection('decks').remove({ _id: ObjectId.createFromHexString(req.params.id) }, function(err) {
                if(err) {
                    res.send({ success: false, message: 'Error deleting deck' });
                    logger.info(err.message);
                    return next(err);
                }

                res.send({ success: true, message: 'Deck deleted successfully', deckId: req.params.id });
            });
        });
    });
};
