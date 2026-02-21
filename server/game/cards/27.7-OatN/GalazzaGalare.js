import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';
import GenericTracker from '../../EventTrackers/GenericTracker.js';

class GalazzaGalare extends DrawCard {
    setupCardAbilities() {
        this.tracker = GenericTracker.forPhase(this.game, 'onClaimApplied');

        this.interrupt({
            when: {
                onPhaseEnded: (event) =>
                    event.phase === 'challenge' &&
                    !this.tracker.some(
                        (event) =>
                            event.player === this.controller &&
                            event.claim.challengeType === 'military'
                    )
            },
            message: '{player} uses {source} to gain 2 power for their faction',
            gameAction: GameActions.gainPower((context) => ({ card: context.player.faction }))
        });
    }
}

GalazzaGalare.code = '27574';
GalazzaGalare.version = '1.0.0';

export default GalazzaGalare;
