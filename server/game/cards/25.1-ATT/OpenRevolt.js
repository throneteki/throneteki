import { ChallengeTracker } from '../../EventTrackers/ChallengeTracker.js';
import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';

class OpenRevolt extends PlotCard {
    // Open Revolt (25020)
    // Interrupt: When the challenges phase ends, if you have not lost an [intrigue] challenge this
    // phase, gain 2 power for your faction. (4 power instead if you have 3 or more Scheme plot
    // cards removed from the game.)
    setupCardAbilities() {
        this.tracker = ChallengeTracker.forPhase(this.game);

        const amountToGain = (context) =>
            context.player.outOfGamePile.filter((card) =>
                card.isMatch({ type: 'plot', trait: 'Scheme' })
            ).length >= 3
                ? 4
                : 2;
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

OpenRevolt.code = '25020';

export default OpenRevolt;
