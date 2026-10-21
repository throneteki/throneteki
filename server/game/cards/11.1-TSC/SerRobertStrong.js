import DrawCard from '../../drawcard.js';

class SerRobertStrong extends DrawCard {
    // Ser Robert Strong (11010)
    // Shadow (5).
    // Reaction: After Ser Robert Strong comes out of shadows, choose and kill a kneeling character
    // with printed cost 5 or lower.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' && card.kneeled && card.getPrintedCost() <= 5
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to kill {2}',
                    this.controller,
                    this,
                    context.target
                );
                this.game.killCharacter(context.target);
            }
        });
    }
}

SerRobertStrong.code = '11010';

export default SerRobertStrong;
