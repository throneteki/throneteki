import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';

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

LionGate.code = '13010';

export default LionGate;
