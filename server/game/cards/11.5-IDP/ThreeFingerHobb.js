const DrawCard = require('../../drawcard.js');

class ThreeFingerHobb extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onReserveChecked: () => this.controller.hand.length < this.controller.getTotalReserve() && this.controller.canDraw()
            },
            handler: context => {
                let numDrawn = context.player.drawCardsToHand(2).length;
                this.game.addMessage('{0} uses {1} to draw {2} {3}',
                    context.player, this, numDrawn, numDrawn > 1 ? 'cards' : 'card');
            }
        });
    }
}

ThreeFingerHobb.code = '11085';

module.exports = ThreeFingerHobb;
