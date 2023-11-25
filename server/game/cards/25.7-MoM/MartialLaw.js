const ChallengeTracker = require('../../EventTrackers/ChallengeTracker.js');
const DrawCard = require('../../drawcard.js');

class MartialLaw extends DrawCard {
    setupCardAbilities(ability) {
        this.tracker = ChallengeTracker.forRound(this.game);

        this.attachmentRestriction({ type: 'location', limited: false });
        this.whileAttached({
            condition: () => !this.tracker.some({ winner: this.parent.controller, challengeType: 'power' }),
            effect: ability.effects.cannotBeStood()
        });
    }
}

MartialLaw.code = '25510';
MartialLaw.version = '2.1';

module.exports = MartialLaw;
