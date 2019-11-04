const DrawCard = require('../../drawcard.js');

class WyllaManderly extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCharacterKilled: event => event.card.controller === this.controller,
                onSacrificed: event => event.card.controller === this.controller
            },
            target: {
                cardCondition: (card, context) => card.location === 'discard pile' && card.controller === this.controller && card !== context.event.card
            },
            message: '{player} uses {source} to move {target} to the bottom of their deck',
            handler: context => {
                this.game.placeOnBottomOfDeck(context.target);
            },
            limit: ability.limit.perPhase(1)
        });
    }
}

WyllaManderly.code = '15035';

module.exports = WyllaManderly;
