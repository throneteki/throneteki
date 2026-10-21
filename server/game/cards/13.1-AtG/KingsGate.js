import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';

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

KingsGate.code = '13008';

export default KingsGate;
