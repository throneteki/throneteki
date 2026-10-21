import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WinterIsComing extends DrawCard {
    // Winter Is Coming (01159)
    // Play only during a challenge.
    // Action: Until the end of the challenge, raise the claim value on your revealed plot card by
    // 1. (Max 1 per challenge.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Raise claim by 1',
            max: ability.limit.perChallenge(1),
            condition: (context) => context.game.isDuringChallenge(),
            message:
                '{player} plays {source} to raise the claim value on their revealed plot card by 1 until the end of the challenge',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: (card) => card === context.player.activePlot,
                effect: ability.effects.modifyClaim(1)
            }))
        });
    }
}

WinterIsComing.code = '01159';

export default WinterIsComing;
