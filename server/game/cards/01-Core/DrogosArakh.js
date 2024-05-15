import DrawCard from '../../drawcard.js';
import { ChallengeTracker } from '../../EventTrackers/index.js';

class DrogosArakh extends DrawCard {
    setupCardAbilities(ability) {
        this.tracker = ChallengeTracker.forRound(this.game);

        this.attachmentRestriction({ trait: 'Dothraki' });
        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
        });
        this.whileAttached({
            condition: () =>
                !this.tracker.some({ attackingPlayer: this.controller, challengeType: 'military' }),
            match: (card) => card.name === 'Khal Drogo',
            effect: ability.effects.doesNotKneelAsAttacker({ challengeType: 'military' })
        });
    }
}

DrogosArakh.code = '01172';

export default DrogosArakh;
