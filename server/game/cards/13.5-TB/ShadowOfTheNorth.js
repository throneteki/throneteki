import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ShadowOfTheNorth extends DrawCard {
    // Shadow of the North (13082)
    // Shadow (1). Play only during a challenge.
    // Action: Raise the claim value on your revealed plot card by 1 until the end of the challenge.
    // If there is a Winter plot card revealed, return Shadow of the North to your hand instead of
    // placing it in your discard pile. (Max 1 per challenge.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Raise claim by 1',
            max: ability.limit.perChallenge(1),
            condition: (context) => context.game.isDuringChallenge(),
            message:
                '{player} plays {source} to raise the claim value on their revealed plot card by 1 until the end of the challenge',
            gameAction: GameActions.simultaneously([
                GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfChallenge',
                    match: (card) => card === context.player.activePlot,
                    effect: ability.effects.modifyClaim(1)
                })),
                GameActions.ifCondition({
                    condition: (context) => context.game.anyPlotHasTrait('Winter'),
                    thenAction: GameActions.returnCardToHand((context) => ({
                        card: context.source
                    }))
                })
            ])
        });
    }
}

ShadowOfTheNorth.code = '13082';

export default ShadowOfTheNorth;
