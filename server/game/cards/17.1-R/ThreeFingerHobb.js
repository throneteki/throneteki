import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';

class ThreeFingerHobb extends DrawCard {
    // Three-Finger Hobb (17119)
    // No attachments except Weapon.
    // Reaction: After you check reserve, if your hand size is lower than your reserve value, draw 1
    // card (draw 2 cards instead if your hand size is at least 5 lower than your reserve value.)
    setupCardAbilities() {
        this.reaction({
            when: {
                onReserveChecked: () =>
                    this.controller.getHandCount() < this.controller.getReserve() &&
                    this.controller.canDraw()
            },
            handler: (context) => {
                let cards = context.player.getReserve() > context.player.getHandCount() + 4 ? 2 : 1;
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

export default ThreeFingerHobb;
