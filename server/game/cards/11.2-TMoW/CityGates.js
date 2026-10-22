import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class CityGates extends DrawCard {
    // City Gates (11038)
    // Limited.
    // Action: Pay 1 gold and discard City Gates from your hand to draw 1 card.
    // +1 Income.
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });
        this.action({
            title: 'Draw 1 card',
            condition: (context) => context.source.controller.canDraw(),
            cost: [ability.costs.payGold(1), ability.costs.discardSelfFromHand()],
            location: 'hand',
            message: '{player} pays 1 gold and discards {source} from their hand to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

CityGates.code = '11038';

export default CityGates;
