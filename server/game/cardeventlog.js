const _ = require('underscore');

const EventRegistrar = require('./eventregistrar.js');

class CardEventLog {
    constructor(game) {
        this.game = game;
        this.events = new EventRegistrar(game, this);

        this.log = [];

        this.events.register(['onCharacterKilled']);
    }

    any(predicate) {
        return _.any(this.log, predicate);
    }

    filterCards(predicate) {
        return _.pluck(_.filter(this.log, predicate), 'card');
    }

    register(type, card) {
        this.log.push({ type: type, card: card, round: this.game.round, phase: this.game.currentPhase });
    }

    onCharacterKilled(event) {
        this.register('kill', event.card);
    }
}

module.exports = CardEventLog;
