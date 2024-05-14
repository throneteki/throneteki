import DrawCard from '../../drawcard.js';

class HonorBound extends DrawCard {
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
