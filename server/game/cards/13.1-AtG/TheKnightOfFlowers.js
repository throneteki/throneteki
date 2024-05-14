const DrawCard = require('../../drawcard');

class TheKnightOfFlowers extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card.controller === this.controller
            },
            limit: ability.limit.perPhase(2),
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' && card.hasTrait('Kingsguard') && card.kneeled
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to stand {2}',
                    this.controller,
                    this,
                    context.target
                );
                context.player.standCard(context.target);
            }
        });
    }
}

TheKnightOfFlowers.code = '13003';

module.exports = TheKnightOfFlowers;
