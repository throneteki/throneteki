import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';

class ThreeFingerHobb extends DrawCard {
    // Three-Finger Hobb (11085)
    // No attachments except Weapon.
    // Reaction: After you check reserve, if your hand size is lower than your reserve value, draw 2
    // cards.
    setupCardAbilities() {
        this.reaction({
            when: {
                onReserveChecked: () =>
                    this.controller.getHandCount() < this.controller.getReserve() &&
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

export default ThreeFingerHobb;
