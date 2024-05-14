const DrawCard = require('../../drawcard');
const { ChallengeTracker } = require('../../EventTrackers');

class Mhysa extends DrawCard {
    setupCardAbilities(ability) {
        this.tracker = ChallengeTracker.forRound(this.game);

        this.attachmentRestriction({ trait: 'Lady' });
        this.whileAttached({
            condition: () =>
                !this.tracker.some({ attackingPlayer: this.controller, challengeType: 'power' }),
            effect: ability.effects.doesNotKneelAsAttacker({ challengeType: 'power' })
        });

        this.whileAttached({
            condition: () =>
                this.tracker.count({ attackingPlayer: this.controller, challengeType: 'power' }) ===
                    1 &&
                this.game.isDuringChallenge({
                    attackingPlayer: this.controller,
                    challengeType: 'power'
                }),
            effect: ability.effects.dynamicStrength(() => this.getAttackingCharacters())
        });
    }

    getAttackingCharacters() {
        if (!this.game.isDuringChallenge()) {
            return 0;
        }

        return this.game.currentChallenge.attackers.length;
    }
}

Mhysa.code = '08094';

module.exports = Mhysa;
