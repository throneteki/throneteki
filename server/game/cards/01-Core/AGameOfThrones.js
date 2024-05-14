const PlotCard = require('../../plotcard.js');
const { ChallengeTracker } = require('../../EventTrackers');

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

module.exports = AGameOfThrones;
