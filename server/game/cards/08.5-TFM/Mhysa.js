import DrawCard from '../../drawcard.js';
import { ChallengeTracker } from '../../EventTrackers/index.js';

class Mhysa extends DrawCard {
    // Mhysa (08094)
    // Lady character only.
    // During the first [power] challenge you initiate each round, attached character does not kneel
    // when declared as an attacker and gets +1 STR for each attacking character.
    setupCardAbilities(ability) {
        const tracker = ChallengeTracker.forRound(this.game);

        this.attachmentRestriction({ trait: 'Lady' });
        this.whileAttached({
            condition: (context) =>
                !tracker.some({
                    attackingPlayer: context.source.controller,
                    challengeType: 'power'
                }),
            effect: ability.effects.doesNotKneelAsAttacker({ challengeType: 'power' })
        });

        this.whileAttached({
            condition: (context) =>
                tracker.count({
                    attackingPlayer: context.source.controller,
                    challengeType: 'power'
                }) === 1 &&
                context.game.isDuringChallenge({
                    attackingPlayer: context.source.controller,
                    challengeType: 'power'
                }),
            effect: ability.effects.dynamicStrength((card, context) =>
                context.game.isDuringChallenge()
                    ? context.game.currentChallenge.attackers.length
                    : 0
            )
        });
    }
}

Mhysa.code = '08094';

export default Mhysa;
