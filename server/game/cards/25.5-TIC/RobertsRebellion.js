import GameActions from '../../GameActions/index.js';
import PlotCard from '../../plotcard.js';
import { ChallengeTracker } from '../../EventTrackers/ChallengeTracker.js';

class RobertsRebellion extends PlotCard {
    // Robert's Rebellion (25082)
    // Forced Interrupt: When the challenges phase ends, if you have lost a [power] challenge this
    // phase, discard 3 power from your faction card.
    setupCardAbilities() {
        this.tracker = ChallengeTracker.forRound(this.game);

        this.forcedInterrupt({
            when: {
                onPhaseEnded: (event, context) =>
                    event.phase === 'challenge' &&
                    context.source.tracker.some({
                        loser: context.source.controller,
                        challengeType: 'power'
                    })
            },
            message: {
                format: '{player} is forced to discard {amount} power from their faction card for {source}',
                args: { amount: (context) => context.source.getPowerAmount(context) }
            },
            gameAction: GameActions.discardPower((context) => ({
                card: context.player.faction,
                amount: context.source.getPowerAmount(context)
            }))
        });
    }

    getPowerAmount(context) {
        return Math.min(context.player.faction.power, 3);
    }
}

RobertsRebellion.code = '25082';

export default RobertsRebellion;
