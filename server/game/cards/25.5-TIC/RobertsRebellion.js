import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';
import { ChallengeTracker } from '../../EventTrackers/ChallengeTracker.js';

class RobertsRebellion extends PlotCard {
    setupCardAbilities() {
        this.tracker = ChallengeTracker.forRound(this.game);

        this.forcedInterrupt({
            when: {
                onPhaseEnded: (event) =>
                    event.phase === 'challenge' &&
                    this.tracker.some({ loser: this.controller, challengeType: 'power' })
            },
            message: {
                format: '{player} is forced to discard {amount} power from their faction card for {source}',
                args: { amount: (context) => this.getPowerAmount(context) }
            },
            gameAction: GameActions.discardPower((context) => ({
                card: context.player.faction,
                amount: this.getPowerAmount(context)
            }))
        });
    }

    getPowerAmount(context) {
        return Math.min(context.player.faction.power, 3);
    }
}

RobertsRebellion.code = '25082';

export default RobertsRebellion;
