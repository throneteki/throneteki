import DrawCard from '../../drawcard.js';
import TextHelper from '../../TextHelper.js';
import GameActions from '../../GameActions/index.js';

class ThreeFingerHobb extends DrawCard {
    // Three-Finger Hobb (17119)
    // No attachments except Weapon.
    // Reaction: After you check reserve, if your hand size is lower than your reserve value, draw 1
    // card (draw 2 cards instead if your hand size is at least 5 lower than your reserve value.)
    setupCardAbilities() {
        this.reaction({
            when: {
                onReserveChecked: (event, context) =>
                    context.player.getHandCount() < context.player.getReserve()
            },
            message: {
                format: '{player} uses {source} to draw {amount}',
                args: {
                    amount: (context) =>
                        TextHelper.count(
                            context.player.getReserve() > context.player.getHandCount() + 4 ? 2 : 1,
                            'card'
                        )
                }
            },
            gameAction: GameActions.drawCards((context) => ({
                player: context.player,
                amount: context.player.getReserve() > context.player.getHandCount() + 4 ? 2 : 1
            }))
        });
    }
}

ThreeFingerHobb.code = '17119';

export default ThreeFingerHobb;
