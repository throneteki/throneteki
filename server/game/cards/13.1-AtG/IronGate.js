const DrawCard = require('../../drawcard.js');
const TextHelper = require('../../TextHelper');

class IronGate extends DrawCard {
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

module.exports = IronGate;
