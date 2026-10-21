import { ChallengeTracker } from '../../EventTrackers/ChallengeTracker.js';
import DrawCard from '../../drawcard.js';

class MartialLaw extends DrawCard {
    // Martial Law (25062)
    // Non-limited location only. Terminal.
    // Attached location cannot stand unless its controller has won a [power] challenge this round.
    setupCardAbilities(ability) {
        this.tracker = ChallengeTracker.forRound(this.game);

        this.attachmentRestriction({ type: 'location', limited: false });
        this.whileAttached({
            condition: () =>
                !this.tracker.some({ winner: this.parent.controller, challengeType: 'power' }),
            effect: ability.effects.cannotBeStood()
        });
    }
}

MartialLaw.code = '25062';

export default MartialLaw;
