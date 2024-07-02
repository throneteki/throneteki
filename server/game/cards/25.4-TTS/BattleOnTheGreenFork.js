import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class BattleOnTheGreenFork extends PlotCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.attackingPlayer === this.controller
            },
            limit: ability.limit.perPhase(3),
            message:
                '{player} uses {source} to raise the claim on {source} by 1 until the end of the phase',
            gameAction: GameActions.genericHandler(() => {
                this.untilEndOfPhase((ability) => ({
                    match: this,
                    effect: ability.effects.modifyClaim(1)
                }));
            })
        });
    }
}

BattleOnTheGreenFork.code = '25079';

export default BattleOnTheGreenFork;
