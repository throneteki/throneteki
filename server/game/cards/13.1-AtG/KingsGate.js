import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class KingsGate extends DrawCard {
    // King's Gate (13008)
    // Limited.
    // Challenges Action: If you have 5 or more power on your faction card, sacrifice King's Gate to
    // draw 2 cards.
    // +1 Income.
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });
        this.action({
            title: 'Sacrifice to draw 2 cards',
            condition: (context) => context.player.faction.power >= 5,
            phase: 'challenge',
            cost: ability.costs.sacrificeSelf(),
            message: '{player} sacrifices {source} to draw 2 cards',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 2 }))
        });
    }
}

KingsGate.code = '13008';

export default KingsGate;
