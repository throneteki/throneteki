const _ = require('underscore');

const logger = require('../log.js');

class GameService {
    constructor(db) {
        this.games = db.get('games');
    }

    create(game) {
        return this.games.insert(game)
            .catch(err => {
                logger.error('Unable to create game %s', err);
                throw new Error('Unable to create game');
            });
    }

    update(game) {
        let properties = {
            eventName: game.eventName,
            startedAt: new Date(game.startedAt),
            players: game.players,
            winner: game.winner,
            winReason: game.winReason,
            finishedAt: new Date(game.finishedAt)
        };
        return this.games.update({ gameId: game.gameId }, { '$set': properties })
            .catch(err => {
                logger.error('Unable to update game %s', err);
                throw new Error('Unable to update game');
            });
    }

    getAllGames(from, to) {
        return this.games.find()
            .then(games => {
                return _.filter(games, game => {
                    return (from ? game.startedAt >= new Date(from) : true) && (to ? game.startedAt < new Date(to) : true);
                });
            })
            .catch(err => {
                logger.error('Unable to get all games from %s to %s %s', from, to, err);
                throw new Error('Unable to get all games');
            });
    }
}

module.exports = GameService;

