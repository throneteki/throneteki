import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ThreeFingerHobb extends DrawCard {
    // Three-Finger Hobb (11085)
    // No attachments except Weapon.
    // Reaction: After you check reserve, if your hand size is lower than your reserve value, draw 2
    // cards.
    setupCardAbilities() {
        this.reaction({
            when: {
                onReserveChecked: (event, context) =>
                    context.source.controller.getHandCount() <
                        context.source.controller.getReserve() &&
                    context.source.controller.canDraw()
            },
            message: '{player} uses {source} to draw 2 cards',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 2 }))
        });
    }
}

ThreeFingerHobb.code = '11085';

export default ThreeFingerHobb;
