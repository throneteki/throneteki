import DrawCard from '../../drawcard.js';

class SerRobertStrong extends DrawCard {
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
