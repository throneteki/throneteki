import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';

class DragonGate extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });
        this.action({
            title: 'Sacrifice to draw 2 cards',
            condition: (context) => this.getCardCount(context.player) >= 2,
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

    getCardCount(player) {
        return player.getNumberOfCardsInPlay((card) => ['attachment'].includes(card.getType()));
    }
}

DragonGate.code = '13014';

export default DragonGate;
