import DrawCard from '../../drawcard.js';

class ObaraSand extends DrawCard {
    // Obara Sand (01108)
    // Obara Sand may be declared as a defender during [power] challenges in which you are the
    // defending player, even while kneeling.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.game.isDuringChallenge({
                    challengeType: 'power',
                    defendingPlayer: context.source.controller
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
