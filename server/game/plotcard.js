const _ = require('underscore');

const BaseCard = require('./basecard.js');

class PlotCard extends BaseCard {
    registerEvents(events) {
        this.events = [];

        _.each(events, event => {
            this[event] = this[event].bind(this);

            this.game.on(event, this[event]);

            this.events.push(event);
        });
    }

    getInitiative() {
        return this.cardData.initiative;
    }

    getIncome() {
        return this.cardData.income;
    }

    getReserve() {
        return this.cardData.reserve;
    }

    getClaim() {
        return this.cardData.claim;
    }

    canChallenge() {
        return true;
    }

    revealed() {
        this.inPlay = true;
    }

    leavesPlay() {
        _.each(this.events, event => {
            this.game.removeListener(event, this[event]);
        });

        this.inPlay = false;
    }
}

module.exports = PlotCard;
