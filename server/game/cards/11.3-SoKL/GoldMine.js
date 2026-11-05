import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GoldMine extends DrawCard {
    // Gold Mine (11050)
    // Action: Kneel Gold Mine and discard 1 card from your hand to draw 1 card.
    // +1 Income.
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw 1 card',
            condition: (context) => context.source.controller.canDraw(),
            cost: [ability.costs.kneelSelf(), ability.costs.discardFromHand()],
            message:
                '{player} kneels {source} and discards {costs.discardFromHand} from their hand to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
        });

        this.plotModifiers({
            gold: 1
        });
    }
}

GoldMine.code = '11050';

export default GoldMine;
