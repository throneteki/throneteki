import DrawCard from '../../drawcard.js';

class BastardOfRobert extends DrawCard {
    // Bastard of Robert (14015)
    // While you control Robert Baratheon, reduce the cost to marshal Bastard of Robert by 2.
    // Reaction: After Bastard of Robert enters play, if you control a King character, draw a card.
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

export default BastardOfRobert;
