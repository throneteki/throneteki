import { ChallengeTracker } from '../../EventTrackers/ChallengeTracker.js';
import DrawCard from '../../drawcard.js';

class MartialLaw extends DrawCard {
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
