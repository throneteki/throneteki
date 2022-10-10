const DrawCard = require('../../drawcard.js');
const {ChallengeTracker} = require('../../EventTrackers');

class SerRobarRoyce extends DrawCard {
    setupCardAbilities(ability) {
        this.tracker = ChallengeTracker.forPhase(this.game);

        this.plotModifiers({
            initiative: -1
        });

        this.persistentEffect({
            condition: () => this.game.isDuringChallenge({ initiatingPlayer: this.controller }) && !this.tracker.some({ initiatingPlayer: this.controller, match: challenge => challenge !== this.game.currentChallenge })
                || this.game.isDuringChallenge({ initiatedAgainstPlayer: this.controller }) && !this.tracker.some({ initiatedAgainstPlayer: this.controller, match: challenge => challenge !== this.game.currentChallenge }),
            match: this,
            effect: [
                ability.effects.cannotBeDeclaredAsAttacker(),
                ability.effects.cannotBeDeclaredAsDefender()
            ]
        });
    }
}

SerRobarRoyce.code = '23015';

module.exports = SerRobarRoyce;
