import DrawCard from '../../drawcard.js';

class HonorBound extends DrawCard {
    // Honor-Bound (11022)
    // During [military] challenges, attached character gets +2 STR.
    // Attached character cannot be declared as an attacker or defender in [intrigue] challenges.
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: () => this.game.isDuringChallenge({ challengeType: 'military' }),
            effect: ability.effects.modifyStrength(2)
        });
        this.whileAttached({
            condition: () => this.game.isDuringChallenge({ challengeType: 'intrigue' }),
            effect: [
                ability.effects.cannotBeDeclaredAsAttacker(),
                ability.effects.cannotBeDeclaredAsDefender()
            ]
        });
    }
}

HonorBound.code = '11022';

export default HonorBound;
