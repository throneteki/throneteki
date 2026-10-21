import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';

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
            handler: (context) => {
                let cards = context.player.drawCardsToHand(2).length;
                this.game.addMessage(
                    '{0} sacrifices {1} to draw {2}',
                    context.player,
                    this,
                    TextHelper.count(cards, 'card')
                );
            }
        });
    }
}

IronGate.code = '13012';

export default IronGate;
