const DrawCard = require('../../drawcard');

class RogueWildling extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            target: {
                cardCondition: (card) =>
                    card.controller === this.controller &&
                    card.getType() === 'character' &&
                    card.hasTrait('Wildling') &&
                    card.kneeled,
                gameAction: 'stand'
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to stand {2}',
                    context.player,
                    this,
                    context.target
                );
                this.controller.standCard(context.target);
            }
        });
    }
}

RogueWildling.code = '12040';

module.exports = RogueWildling;
