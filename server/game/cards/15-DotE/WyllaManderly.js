const DrawCard = require('../../drawcard.js');

class WyllaManderly extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCharacterKilled: event => event.card.controller === this.controller && this.canChangeGameState(event.card),
                onSacrificed: event => event.card.controller === this.controller && this.canChangeGameState(event.card)
            },
            limit: ability.limit.perRound(1),
            target: {
                cardCondition: (card, context) => card.location === 'discard pile' && card.controller === this.controller && card !== context.event.card
            },
            handler: context => {
                this.game.placeOnBottomOfDeck(context.target);
                this.game.addMessage('{0} uses {1} to move {2} to the bottom of their deck', this.controller, this, context.target);
            }
        });
    }

    canChangeGameState(cardSacrificedOrKilled) {
        let cards = this.controller.discardPile.filter(card => card !== cardSacrificedOrKilled);
        return cards.length > 0;
    }
}

WyllaManderly.code = '15035';

module.exports = WyllaManderly;
