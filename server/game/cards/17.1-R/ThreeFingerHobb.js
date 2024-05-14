const DrawCard = require('../../drawcard.js');
const TextHelper = require('../../TextHelper');

class ThreeFingerHobb extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onReserveChecked: () =>
                    this.controller.hand.length < this.controller.getTotalReserve() &&
                    this.controller.canDraw()
            },
            handler: (context) => {
                let cards =
                    context.player.getTotalReserve() > context.player.hand.length + 4 ? 2 : 1;
                cards = context.player.drawCardsToHand(cards).length;
                this.game.addMessage(
                    '{0} uses {1} to draw {2}',
                    context.player,
                    this,
                    TextHelper.count(cards, 'card')
                );
            }
        });
    }
}

ThreeFingerHobb.code = '17119';

module.exports = ThreeFingerHobb;
