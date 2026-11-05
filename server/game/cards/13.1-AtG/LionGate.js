import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class LionGate extends DrawCard {
    // Lion Gate (13010)
    // Limited.
    // Challenges Action: If you control 2 or more cards in shadows, sacrifice Lion Gate to draw 2
    // cards.
    // +1 Income.
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });
        this.action({
            title: 'Sacrifice to draw 2 cards',
            condition: (context) => context.player.shadows.length >= 2,
            phase: 'challenge',
            cost: ability.costs.sacrificeSelf(),
            message: '{player} sacrifices {source} to draw 2 cards',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 2 }))
        });
    }
}

LionGate.code = '13010';

export default LionGate;
