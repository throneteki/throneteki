import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class TheSpidersWeb extends PlotCard {
    // The Spider's Web (09049)
    // Reaction: After claim is applied for an [intrigue] challenge you won, you may initiate an
    // additional [intrigue] challenge this phase. Until the end of the phase, raise the claim value
    // on your revealed plot card by 1 during [intrigue] challenges. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            limit: ability.limit.perPhase(1),
            when: {
                onClaimApplied: (event, context) =>
                    event.challenge &&
                    event.player === context.source.controller &&
                    event.challenge.challengeType === 'intrigue'
            },
            message:
                '{player} uses {source} to be able to initiate an additional intrigue challenge with claim raised by 1',
            gameAction: GameActions.simultaneously([
                GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfPhase',
                    targetController: 'current',
                    effect: ability.effects.mayInitiateAdditionalChallenge('intrigue')
                })),
                GameActions.lastingEffect((context) => ({
                    duration: 'untilEndOfPhase',
                    condition: () => context.game.isDuringChallenge({ challengeType: 'intrigue' }),
                    match: (card) => card === context.player.activePlot,
                    effect: ability.effects.modifyClaim(1)
                }))
            ])
        });
    }
}

TheSpidersWeb.code = '09049';

export default TheSpidersWeb;
