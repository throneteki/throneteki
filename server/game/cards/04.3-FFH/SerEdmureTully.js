const DrawCard = require('../../drawcard.js');

class SerEdmureTully extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPowerGained: (event) => event.card.getType() === 'character'
            },
            limit: ability.limit.perRound(1),
            target: {
                cardCondition: (card, context) =>
                    card !== context.event.card &&
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.hasTrait('House Tully')
            },
            handler: (context) => {
                this.game.movePower(context.event.card, context.target, 1);
                this.game.addMessage(
                    '{0} uses {1} to move 1 power from {2} to {3}',
                    this.controller,
                    this,
                    context.event.card,
                    context.target
                );
            }
        });
    }
}

SerEdmureTully.code = '04041';

module.exports = SerEdmureTully;
