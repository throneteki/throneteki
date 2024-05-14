import PlotCard from '../../plotcard.js';
import { ChallengeTracker } from '../../EventTrackers/index.js';

class AGameOfThrones extends PlotCard {
    setupCardAbilities(ability) {
        this.tracker = ChallengeTracker.forPhase(this.game);

        this.persistentEffect({
            targetController: 'any',
            match: (player) =>
                this.tracker.count({ winner: player, challengeType: 'intrigue' }) < 1,
            effect: [
                ability.effects.cannotInitiateChallengeType('military'),
                ability.effects.cannotInitiateChallengeType('power')
            ]
        });
    }
}

AGameOfThrones.code = '01003';

export default AGameOfThrones;
