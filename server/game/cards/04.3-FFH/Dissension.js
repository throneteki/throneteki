import DrawCard from '../../drawcard.js';

class Dissension extends DrawCard {
    // Dissension (04059)
    // Marshaling Action: Choose an Ally character, and discard it from play.
    setupCardAbilities() {
        this.action({
            title: 'Discard Ally from play',
            phase: 'marshal',
            target: {
                cardCondition: (card) =>
                    card.hasTrait('Ally') &&
                    card.getType() === 'character' &&
                    card.location === 'play area'
            },
            handler: (context) => {
                context.target.controller.discardCard(context.target);
                this.game.addMessage(
                    '{0} plays {1} to discard {2}',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

Dissension.code = '04059';

export default Dissension;
