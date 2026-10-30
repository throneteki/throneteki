import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class BattleOnTheGreenFork extends PlotCard {
    // Battle on the Green Fork (25079)
    // Reaction: After you win a challenge as the attacking player, raise the claim value on Battle
    // on the Green Fork by 1 until the end of the phase. (Limit 3 times per phase.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    event.challenge.attackingPlayer === context.source.controller
            },
            limit: ability.limit.perPhase(3),
            message:
                '{player} uses {source} to raise the claim on {source} by 1 until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.source,
                effect: ability.effects.modifyClaim(1)
            }))
        });
    }
}

BattleOnTheGreenFork.code = '25079';

export default BattleOnTheGreenFork;
