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
                // Add the icon as a UI hint, but Obara can be declared even if
                // the opponent removes that icon somehow.
                ability.effects.addIcon('power'),
                ability.effects.canBeDeclaredWithoutIcon(),
                ability.effects.canBeDeclaredWhileKneeling()
            ]
        });
    }
}

ObaraSand.code = '01108';

export default ObaraSand;
