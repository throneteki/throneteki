import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SerRobertStrong extends DrawCard {
    // Ser Robert Strong (11010)
    // Shadow (5).
    // Reaction: After Ser Robert Strong comes out of shadows, choose and kill a kneeling character
    // with printed cost 5 or lower.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) => event.card === context.source
            },
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' && card.kneeled && card.getPrintedCost() <= 5
            },
            message: '{player} uses {source} to kill {target}',
            gameAction: GameActions.kill((context) => ({ card: context.target }))
        });
    }
}

SerRobertStrong.code = '11010';

export default SerRobertStrong;
