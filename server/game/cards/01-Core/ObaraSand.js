import DrawCard from '../../drawcard.js';

class ObaraSand extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game.isDuringChallenge({
                    challengeType: 'power',
                    defendingPlayer: this.controller
                }),
            match: this,
            effect: [
                ability.effects.canBeDeclaredWithoutIcon(),
                ability.effects.canBeDeclaredWhileKneeling()
            ]
        });
    }
}

ObaraSand.code = '01108';

export default ObaraSand;
