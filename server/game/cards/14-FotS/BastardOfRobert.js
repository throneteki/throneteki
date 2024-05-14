const DrawCard = require('../../drawcard');

class BastardOfRobert extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: () =>
                this.controller.anyCardsInPlay((card) => card.name === 'Robert Baratheon'),
            targetController: 'current',
            effect: ability.effects.reduceSelfCost('marshal', 2)
        });

        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card === this &&
                    this.controller.anyCardsInPlay(
                        (card) => card.getType() === 'character' && card.hasTrait('King')
                    ) &&
                    this.controller.canDraw()
            },
            message: '{player} uses {source} to draw 1 card',
            handler: (context) => {
                context.player.drawCardsToHand(1);
            }
        });
    }
}

BastardOfRobert.code = '14015';

module.exports = BastardOfRobert;
