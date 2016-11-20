const _ = require('underscore');

var locations = {};

// 01039 - The Kingsroad
class TheKingsRoad {
    constructor(player, card) {
        this.player = player;
        this.card = card;

        card.initiative = 1;

        this.cardClick = this.cardClick.bind(this);
        this.beforeCardPlayed = this.beforeCardPlayed.bind(this);
        this.afterCardPlayed = this.afterCardPlayed.bind(this);
        this.cardsStanding = this.cardsStanding.bind(this);
    }

    cardClick(game, player, card) {
        if(this.player !== player || this.card.uuid !== card.uuid) {
            return;
        }

        if(player.phase !== 'marshal') {
            return;
        }

        var cardInPlay = _.find(player.cardsInPlay, c => {
            return c.card.uuid === card.uuid;
        });

        if(!cardInPlay || cardInPlay.kneeled) {
            return;
        }

        cardInPlay.kneeled = true;
        game.clickHandled = true;

        player.discardCard(card, player.discardPile);

        game.addMessage('{0} sacrifices {1} to reduce the cost of the next character they marshal by 3', player.name, card);

        this.active = true;
    }

    beforeCardPlayed(game, player, card) {
        if(this.player !== player) {
            return;
        }

        if(this.active && !this.abilityUsed && card.type_code === 'character' && card.cost > 0) {
            this.cost = card.cost;

            card.cost -= 3;
            if(card.cost < 0) {
                card.cost = 0;
            }

            this.abilityUsed = true;
            game.addMessage('{0} uses {1} to reduce the cost of {2} by 3', player.name, this.card, card);
        }
    }

    afterCardPlayed(game, player, card) {
        if(this.card !== card) {
            return;
        }

        card.cost = this.cost;
    }

    cardsStanding() {
        this.abilityUsed = false;
        this.active = false;
    }
}
locations['01039'] = {
    register: function(game, player, card) {
        var implementation = new TheKingsRoad(player, card);

        game.on('cardClicked', implementation.cardClick);
        game.on('beforeCardPlayed', implementation.beforeCardPlayed);
        game.on('afterCardPlayed', implementation.afterCardPlayed);
        game.on('cardsStanding', implementation.cardsStanding);
    },
    unregister: function(game, player, card) {
        var implementation = game.playerCards[player.id + card.uuid];

        game.removeListener('cardClicked', implementation.cardClick);
        game.removeListener('beforeCardPlayed', implementation.beforeCardPlayed);
        game.removeListener('afterCardPlayed', implementation.afterCardPlayed);
        game.removeListener('cardsStanding', implementation.cardsStanding);
    }
};

module.exports = locations;
