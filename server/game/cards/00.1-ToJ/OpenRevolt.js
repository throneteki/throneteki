import { ChallengeTracker } from '../../EventTrackers/ChallengeTracker.js';
import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class OpenRevolt extends PlotCard {
    setupCardAbilities() {
        this.tracker = ChallengeTracker.forPhase(this.game);

        const amountToGain = (context) =>
            context.player.getNumberOfUsedPlotsByTrait('Scheme') >= 3 ? 4 : 2;
        this.interrupt({
            when: {
                onPhaseEnded: (event) =>
                    event.phase === 'challenge' &&
                    this.tracker.count({ challengeType: 'intrigue', loser: this.controller }) === 0
            },
            message: {
                format: '{player} uses {source} to gain {amount} power',
                args: { amount: amountToGain }
            },
            gameAction: GameActions.gainPower((context) => ({
                amount: amountToGain(context),
                card: context.player.faction
            }))
        });
    }
}

OpenRevolt.code = '00337';

export default OpenRevolt;
