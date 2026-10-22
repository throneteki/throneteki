import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class IronGate extends DrawCard {
    // Iron Gate (13012)
    // Limited.
    // Challenges Action: If you are the first player, sacrifice Iron Gate to draw 2 cards.
    // +1 Income.
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });
        this.action({
            title: 'Sacrifice to draw 2 cards',
            condition: (context) => context.player.firstPlayer,
            phase: 'challenge',
            cost: ability.costs.sacrificeSelf(),
            message: '{player} sacrifices {source} to draw 2 cards',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 2 }))
        });
    }
}

IronGate.code = '13012';

export default IronGate;
