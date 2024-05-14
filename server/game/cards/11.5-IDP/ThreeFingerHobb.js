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
                let numDrawn = context.player.drawCardsToHand(2).length;
                this.game.addMessage(
                    '{0} uses {1} to draw {2}',
                    context.player,
                    this,
                    TextHelper.count(numDrawn, 'card')
                );
            }
        });
    }
}

ThreeFingerHobb.code = '11085';

module.exports = ThreeFingerHobb;
