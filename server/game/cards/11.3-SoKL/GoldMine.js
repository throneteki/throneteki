const DrawCard = require('../../drawcard.js');

class GoldMine extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw 1 card',
            condition: () => this.controller.canDraw(),
            cost: [ability.costs.kneelSelf(), ability.costs.discardFromHand()],
            handler: (context) => {
                context.player.drawCardsToHand(1);
                this.game.addMessage(
                    '{0} kneels {1} and discards {2} from their hand to draw 1 card',
                    context.player,
                    this,
                    context.costs.discardFromHand
                );
            }
        });

        this.plotModifiers({
            gold: 1
        });
    }
}

GoldMine.code = '11050';

module.exports = GoldMine;
