import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

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
            message: '{player} plays {source} to discard {target}',
            gameAction: GameActions.discardCard((context) => ({ card: context.target }))
        });
    }
}

Dissension.code = '04059';

export default Dissension;
