import DrawCard from '../../drawcard.js';
import { ChallengeTracker } from '../../EventTrackers/index.js';

class Mhysa extends DrawCard {
    // Mhysa (08094)
    // Lady character only.
    // During the first [power] challenge you initiate each round, attached character does not kneel
    // when declared as an attacker and gets +1 STR for each attacking character.
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

export default Mhysa;
