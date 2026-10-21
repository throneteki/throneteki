import DrawCard from '../../drawcard.js';
import Conditions from '../../Conditions.js';
import GameActions from '../../GameActions/index.js';

class OldGate extends DrawCard {
    // Old Gate (13002)
    // Limited.
    // Challenges Action: If each character you control has the [stark] affiliation, sacrifice Old
    // Gate to draw 2 cards.
    // +1 Income.
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });

        this.action({
            title: 'Sacrifice to draw 2 cards',
            condition: (context) => Conditions.allCharactersAreStark({ player: context.player }),
            phase: 'challenge',
            cost: ability.costs.sacrificeSelf(),
            gameAction: GameActions.drawCards((context) => ({
                player: context.player,
                amount: 2
            }))
        });
    }
}

OldGate.code = '13002';

export default OldGate;
